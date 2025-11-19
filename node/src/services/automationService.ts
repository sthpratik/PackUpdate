/**
 * Git automation service for PackUpdate
 */
import { execSync, spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { AutomationConfig, GitOperationResult, PullRequestData, UpdateResult } from "../types";
import { log, writeLog } from "../utils/logger";

/**
 * Normalize Bitbucket server endpoint (remove trailing slash and /rest/api paths)
 */
const normalizeBitbucketEndpoint = (endpoint: string): string => {
  return endpoint
    .replace(/\/+$/, '') // Remove trailing slashes
    .replace(/\/rest\/api.*$/, ''); // Remove any /rest/api paths
};

/**
 * Get SSH port and hostname from Bitbucket repository info
 */
const getBitbucketSSHInfo = async (baseUrl: string, repository: string, token: string): Promise<{hostname: string, port: number}> => {
  try {
    const apiUrl = getBitbucketApiUrl(baseUrl, repository).replace('/pull-requests', '');
    const response = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const repoInfo = await response.json() as any;
      const sshCloneUrl = repoInfo.links?.clone?.find((link: any) => link.name === 'ssh')?.href;
      
      if (sshCloneUrl) {
        // Parse SSH URL: ssh://git@hostname:port/path.git
        const match = sshCloneUrl.match(/ssh:\/\/git@([^:]+):(\d+)\//);
        if (match) {
          return { hostname: match[1], port: parseInt(match[2]) };
        }
      }
    }
  } catch (error) {
    log(`⚠️  Could not detect SSH info from API, using defaults: ${error}`);
  }
  
  // Fallback to defaults
  const hostname = baseUrl.replace('https://', '').replace('http://', '').replace(/\/.*$/, '');
  return { hostname, port: 7999 };
};

/**
 * Get Bitbucket clone URL - use SSH with auto-detected port
 */
const getBitbucketCloneUrl = async (baseUrl: string, repository: string, token?: string): Promise<string> => {
  if (token) {
    const { hostname, port } = await getBitbucketSSHInfo(baseUrl, repository, token);
    return `ssh://git@${hostname}:${port}/${repository.toLowerCase()}.git`;
  }
  
  // Fallback without token
  const hostname = baseUrl.replace('https://', '').replace('http://', '').replace(/\/.*$/, '');
  return `ssh://git@${hostname}:7999/${repository.toLowerCase()}.git`;
};

/**
 * Get Bitbucket API URL from base server URL
 */
const getBitbucketApiUrl = (baseUrl: string, repository: string): string => {
  const normalizedUrl = normalizeBitbucketEndpoint(baseUrl);
  const [workspace, repo] = repository.split('/');
  return `${normalizedUrl}/rest/api/1.0/projects/${workspace}/repos/${repo}/pull-requests`;
};

/**
 * Create automation configuration from CLI args
 */
export const createAutomationConfig = (cliArgs: any): AutomationConfig => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const repoName = cliArgs.repository?.replace('/', '_') || 'unknown';
  
  return {
    platform: cliArgs.platform,
    endpoint: cliArgs.endpoint,
    token: cliArgs.token,
    repository: cliArgs.repository,
    baseBranch: cliArgs.baseBranch || 'develop',
    featureBranch: cliArgs.featureBranch || `feature/package-updates-${timestamp}`,
    ticketNo: cliArgs.ticketNo,
    workspaceDir: path.resolve(cliArgs.workspaceDir, `${repoName}_${timestamp}`),
    projectPath: cliArgs.projectPath,
    reviewers: cliArgs.reviewers ? cliArgs.reviewers.split(',').map((r: string) => r.trim()) : []
  };
};

/**
 * Validate automation configuration
 */
export const validateAutomationConfig = (config: AutomationConfig): void => {
  if (!config.platform) {
    throw new Error("Platform is required for automation (--platform)");
  }
  
  if (!config.repository) {
    throw new Error("Repository is required for automation (--repository)");
  }
  
  if (config.platform === 'bitbucket-server') {
    if (!config.endpoint) {
      throw new Error("Bitbucket endpoint is required (--endpoint or PACKUPDATE_BITBUCKET_ENDPOINT)");
    }
    if (!config.token) {
      throw new Error("Bitbucket token is required (--token or PACKUPDATE_BITBUCKET_TOKEN)");
    }
  }
};

/**
 * Setup workspace and clone repository
 */
export const setupWorkspace = async (config: AutomationConfig): Promise<GitOperationResult> => {
  try {
    log(`🏗️  Setting up workspace: ${config.workspaceDir}`);
    
    // Clean and create workspace directory
    if (fs.existsSync(config.workspaceDir)) {
      execSync(`rm -rf "${config.workspaceDir}"`, { stdio: 'pipe' });
    }
    fs.mkdirSync(config.workspaceDir, { recursive: true });
    
    // Determine clone URL based on platform
    let cloneUrl: string;
    if (config.platform === 'bitbucket-server') {
      cloneUrl = await getBitbucketCloneUrl(config.endpoint!, config.repository, config.token);
    } else if (config.platform === 'github') {
      cloneUrl = `git@github.com:${config.repository}.git`;
    } else if (config.platform === 'gitlab') {
      cloneUrl = `git@gitlab.com:${config.repository}.git`;
    } else {
      throw new Error(`Unsupported platform: ${config.platform}`);
    }
    
    log(`📥 Cloning repository: ${cloneUrl}`);
    
    execSync(`git clone "${cloneUrl}" .`, { 
      cwd: config.workspaceDir, 
      stdio: 'pipe'
    });
    
    // Check if base branch exists, fallback to master
    let actualBaseBranch = config.baseBranch;
    try {
      execSync(`git show-ref --verify --quiet refs/remotes/origin/${config.baseBranch}`, { 
        cwd: config.workspaceDir, 
        stdio: 'pipe' 
      });
    } catch {
      log(`⚠️  Base branch '${config.baseBranch}' not found, trying 'master'`);
      actualBaseBranch = 'master';
      try {
        execSync(`git show-ref --verify --quiet refs/remotes/origin/master`, { 
          cwd: config.workspaceDir, 
          stdio: 'pipe' 
        });
      } catch {
        throw new Error("Neither 'develop' nor 'master' branch found");
      }
    }
    
    // Create and checkout feature branch
    log(`🌿 Creating feature branch: ${config.featureBranch} from ${actualBaseBranch}`);
    execSync(`git checkout -b "${config.featureBranch}" "origin/${actualBaseBranch}"`, { 
      cwd: config.workspaceDir, 
      stdio: 'pipe' 
    });
    
    // Install dependencies to ensure npm outdated works correctly
    log(`📦 Installing dependencies...`);
    execSync('npm install', { 
      cwd: config.workspaceDir, 
      stdio: 'pipe' 
    });
    
    return {
      success: true,
      message: `Workspace setup complete: ${config.workspaceDir}`,
      branchCreated: true
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Workspace setup failed: ${error}`
    };
  }
};

/**
 * Generate PR description with update logs and report
 */
export const generatePRDescription = (
  config: AutomationConfig, 
  updateResults: UpdateResult[], 
  reportData: any
): string => {
  const ticketLink = config.ticketNo ? `\n**Ticket:** ${config.ticketNo}\n` : '';
  
  // Aggregate all update results
  const allUpdated = updateResults.flatMap(r => r.updated);
  const allFailed = updateResults.flatMap(r => r.failed);
  
  let description = `# Package Updates${ticketLink}
## Summary
- **Updated Packages:** ${allUpdated.length}
- **Failed Updates:** ${allFailed.length}
- **Total Outdated:** ${reportData?.dependencies?.outdated || 0}

## 📦 Updated Packages
`;

  if (allUpdated.length > 0) {
    allUpdated.forEach(([pkg, oldVer, newVer]) => {
      description += `- \`${pkg}\`: ${oldVer} → ${newVer}\n`;
    });
  } else {
    description += "No packages were updated.\n";
  }

  if (allFailed.length > 0) {
    description += `\n## ❌ Failed Updates\n`;
    allFailed.forEach(pkg => {
      description += `- \`${pkg}\`\n`;
    });
  }

  // Add security report summary
  if (reportData?.security) {
    description += `\n## 🔒 Security Summary
- **Vulnerabilities:** ${reportData.security.vulnerable_packages?.length || 0}
- **Safe Updates:** ${reportData.breakingChanges?.safeUpdates?.length || 0}
- **Risky Updates:** ${reportData.breakingChanges?.riskyUpdates?.length || 0}
`;
  }

  // Add recommendations
  if (reportData?.recommendations?.length > 0) {
    description += `\n## 💡 Recommendations\n`;
    reportData.recommendations.forEach((rec: string) => {
      description += `- ${rec}\n`;
    });
  }

  description += `\n---
*Generated by PackUpdate automation*`;

  return description;
};

/**
 * Commit and push changes
 */
export const commitAndPush = (config: AutomationConfig, updateResults: UpdateResult[]): GitOperationResult => {
  try {
    const allUpdated = updateResults.flatMap(r => r.updated);
    
    if (allUpdated.length === 0) {
      return {
        success: false,
        message: "No packages were updated - no changes to commit"
      };
    }
    
    // Stage all changes
    execSync('git add .', { cwd: config.workspaceDir, stdio: 'pipe' });
    
    // Create commit message
    const ticketPrefix = config.ticketNo ? `${config.ticketNo}: ` : '';
    const commitMessage = `${ticketPrefix}Update ${allUpdated.length} packages

Updated packages:
${allUpdated.map(([pkg, oldVer, newVer]) => `- ${pkg}: ${oldVer} → ${newVer}`).join('\n')}`;
    
    // Commit changes
    execSync(`git commit -m "${commitMessage}"`, { cwd: config.workspaceDir, stdio: 'pipe' });
    
    // Push feature branch
    log(`📤 Pushing feature branch: ${config.featureBranch}`);
    execSync(`git push origin "${config.featureBranch}"`, { cwd: config.workspaceDir, stdio: 'pipe' });
    
    // Get commit hash
    const commitHash = execSync('git rev-parse HEAD', { 
      cwd: config.workspaceDir, 
      encoding: 'utf-8' 
    }).trim();
    
    return {
      success: true,
      message: "Changes committed and pushed successfully",
      commitHash
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Commit/push failed: ${error}`
    };
  }
};

/**
 * Create pull request via Bitbucket API
 */
const createBitbucketPR = (config: AutomationConfig, prData: PullRequestData): Promise<GitOperationResult> => {
  return new Promise((resolve) => {
    try {
      const [workspace, repo] = config.repository!.split('/');
      const apiUrl = getBitbucketApiUrl(config.endpoint!, config.repository!);
      
      const payload = {
        title: prData.title,
        description: prData.description,
        fromRef: {
          id: `refs/heads/${prData.sourceBranch}`,
          repository: {
            slug: repo,
            project: { key: workspace }
          }
        },
        toRef: {
          id: `refs/heads/${prData.targetBranch}`,
          repository: {
            slug: repo,
            project: { key: workspace }
          }
        },
        reviewers: prData.reviewers.map(username => ({ user: { name: username } }))
      };
      
      const curlCommand = `curl -X POST "${apiUrl}" \
        -H "Authorization: Bearer ${config.token}" \
        -H "Content-Type: application/json" \
        -d '${JSON.stringify(payload)}'`;
      
      const result = execSync(curlCommand, { encoding: 'utf-8' });
      const response = JSON.parse(result);
      
      if (response.id) {
        const prUrl = `${config.endpoint}/projects/${workspace}/repos/${repo}/pull-requests/${response.id}`;
        resolve({
          success: true,
          message: "Pull request created successfully",
          prUrl
        });
      } else {
        resolve({
          success: false,
          message: `PR creation failed: ${JSON.stringify(response)}`
        });
      }
      
    } catch (error) {
      resolve({
        success: false,
        message: `PR creation failed: ${error}`
      });
    }
  });
};

/**
 * Create pull request
 */
export const createPullRequest = async (
  config: AutomationConfig, 
  updateResults: UpdateResult[], 
  reportData: any
): Promise<GitOperationResult> => {
  try {
    const allUpdated = updateResults.flatMap(r => r.updated);
    const ticketPrefix = config.ticketNo ? `${config.ticketNo}: ` : '';
    
    const prData: PullRequestData = {
      title: `${ticketPrefix}Package Updates - ${allUpdated.length} packages updated`,
      description: generatePRDescription(config, updateResults, reportData),
      sourceBranch: config.featureBranch,
      targetBranch: config.baseBranch,
      reviewers: config.reviewers
    };
    
    log(`📋 Creating pull request: ${prData.title}`);
    
    if (config.platform === 'bitbucket-server') {
      return await createBitbucketPR(config, prData);
    } else {
      // For GitHub/GitLab, we'll use CLI tools or provide manual instructions
      log(`⚠️  Automated PR creation not yet implemented for ${config.platform}`);
      log(`Please create PR manually:`);
      log(`  Source: ${config.featureBranch}`);
      log(`  Target: ${config.baseBranch}`);
      log(`  Title: ${prData.title}`);
      
      return {
        success: true,
        message: `Branch pushed. Please create PR manually for ${config.platform}`
      };
    }
    
  } catch (error) {
    return {
      success: false,
      message: `PR creation failed: ${error}`
    };
  }
};

/**
 * Cleanup workspace
 */
export const cleanupWorkspace = (config: AutomationConfig): void => {
  try {
    if (fs.existsSync(config.workspaceDir)) {
      execSync(`rm -rf "${config.workspaceDir}"`, { stdio: 'pipe' });
      log(`🧹 Cleaned up workspace: ${config.workspaceDir}`);
    }
  } catch (error) {
    log(`⚠️  Failed to cleanup workspace: ${error}`);
  }
};
