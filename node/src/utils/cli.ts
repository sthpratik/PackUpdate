/**
 * CLI argument parsing and help display
 */
import * as fs from "fs";
import * as path from "path";
import { CliArgs } from "../types";

/**
 * Parse command line arguments
 * @returns Parsed CLI arguments
 */
export const parseCliArgs = (): CliArgs => {
  const args = process.argv.slice(2);
  const flags = args.filter(arg => arg.startsWith('--'));
  const nonFlags = args.filter(arg => !arg.startsWith('--'));
  
  const passArg = flags.find((arg) => arg.startsWith("--pass="));
  const updateVersionArg = flags.find((arg) => arg.startsWith("--update-version="));
  const platformArg = flags.find((arg) => arg.startsWith("--platform="));
  const endpointArg = flags.find((arg) => arg.startsWith("--endpoint="));
  const tokenArg = flags.find((arg) => arg.startsWith("--token="));
  const repositoryArg = flags.find((arg) => arg.startsWith("--repository="));
  const baseBranchArg = flags.find((arg) => arg.startsWith("--base-branch="));
  const featureBranchArg = flags.find((arg) => arg.startsWith("--feature-branch="));
  const ticketNoArg = flags.find((arg) => arg.startsWith("--ticket-no="));
  const workspaceDirArg = flags.find((arg) => arg.startsWith("--workspace-dir="));
  const reviewersArg = flags.find((arg) => arg.startsWith("--reviewers="));
  
  return {
    projectPath: nonFlags[0] || process.cwd(),
    safeMode: flags.includes("--safe"),
    interactive: flags.includes("--interactive"),
    minorOnly: flags.includes("--minor-only"),
    generateReport: flags.includes("--generate-report"),
    removeUnused: flags.includes("--remove-unused"),
    dedupePackages: flags.includes("--dedupe-packages"),
    quietMode: flags.includes("--quiet"),
    passes: passArg ? parseInt(passArg.split("=")[1], 10) : 1,
    updateVersion: updateVersionArg ? updateVersionArg.split("=")[1] : undefined,
    // Automation flags
    automate: flags.includes("--automate"),
    platform: platformArg ? platformArg.split("=")[1] as any : undefined,
    endpoint: endpointArg ? endpointArg.split("=")[1] : process.env.PACKUPDATE_BITBUCKET_ENDPOINT,
    token: tokenArg ? tokenArg.split("=")[1] : process.env.PACKUPDATE_BITBUCKET_TOKEN,
    repository: repositoryArg ? repositoryArg.split("=")[1] : undefined,
    baseBranch: baseBranchArg ? baseBranchArg.split("=")[1] : process.env.PACKUPDATE_BASE_BRANCH || 'develop',
    featureBranch: featureBranchArg ? featureBranchArg.split("=")[1] : undefined,
    ticketNo: ticketNoArg ? ticketNoArg.split("=")[1] : undefined,
    workspaceDir: workspaceDirArg ? workspaceDirArg.split("=")[1] : process.env.PACKUPDATE_WORKSPACE_DIR || './temp-updates',
    reviewers: reviewersArg ? reviewersArg.split("=")[1] : process.env.PACKUPDATE_REVIEWERS
  };
};

/**
 * Check for special flags that don't require main execution
 * @returns True if special flag was handled
 */
export const handleSpecialFlags = (): boolean => {
  const args = process.argv.slice(2);
  const flags = args.filter(arg => arg.startsWith('--'));
  
  if (flags.includes("--help")) {
    showHelp();
    return true;
  }
  
  if (flags.includes("--version")) {
    showVersion();
    return true;
  }
  
  if (flags.includes("--type")) {
    console.log("nodejs");
    return true;
  }
  
  return false;
};

/**
 * Display help message
 */
const showHelp = (): void => {
  console.log(`
PackUpdate - Node.js Package Updater

Usage: updatenpmpackages [project_path] [options]
       updatepkgs [project_path] [options]

Arguments:
  project_path              Path to the Node.js project (default: current directory)

Options:
  --safe                   Enable safe mode (test updates before applying)
  --quiet                  Enable quiet mode (minimal console output)
  --interactive            Interactive mode for selective package updates
  --minor-only             Update only minor versions (1.2.x → 1.3.x, skip major updates)
  --generate-report        Generate comprehensive security & dependency report (no updates)
  --remove-unused          Clean up unused dependencies
  --dedupe-packages        Remove duplicate dependencies
  --update-version=<type>  Update project version after successful updates (major|minor|patch|x.y.z)
  --pass=<number>          Number of update passes (default: 1)

Automation Options:
  --automate               Enable Git automation workflow
  --platform=<type>        Git platform (bitbucket-server|github|gitlab)
  --endpoint=<url>         Bitbucket server base URL (e.g., https://git.cnvrmedia.net)
  --token=<token>          Authentication token (for bitbucket-server platform)
  --repository=<repo>      Repository in format workspace/repo or org/repo
  --base-branch=<branch>   Base branch to create feature branch from (default: develop)
  --feature-branch=<name>  Custom feature branch name (default: auto-generated)
  --ticket-no=<ticket>     Ticket number for commit messages and PR linking
  --workspace-dir=<path>   Temporary workspace directory (default: ./temp-updates)
  --reviewers=<list>       Comma-separated list of reviewers for PR

  --version                Show package version
  --type                   Show package type (nodejs)
  --help                   Show this help message

Environment Variables:
  PACKUPDATE_BITBUCKET_TOKEN     Default Bitbucket authentication token
  PACKUPDATE_BITBUCKET_ENDPOINT  Default Bitbucket server endpoint
  PACKUPDATE_BASE_BRANCH         Default base branch
  PACKUPDATE_WORKSPACE_DIR       Default workspace directory
  PACKUPDATE_REVIEWERS           Default reviewers (comma-separated)

Examples:
  # Basic usage
  updatenpmpackages                           # Update current directory
  updatenpmpackages /path/to/project         # Update specific project
  updatenpmpackages --safe --quiet           # Safe and quiet mode
  updatenpmpackages --generate-report        # Generate security & dependency report

  # Automation examples
  updatenpmpackages --automate \\
    --platform bitbucket-server \\
    --endpoint https://your-bitbucket-server.com \\
    --token your-access-token \\
    --repository WORKSPACE/repository \\
    --ticket-no JIRA-456 \\
    --reviewers john.doe,jane.smith

  updatenpmpackages --automate \\
    --platform github \\
    --repository myorg/myapp \\
    --minor-only \\
    --safe

  # Combined automation with existing features
  updatenpmpackages --automate \\
    --platform bitbucket-server \\
    --repository WORKSPACE/webapp \\
    --ticket-no PROJ-789 \\
    --pass=3 \\
    --remove-unused \\
    --quiet
`);
};

/**
 * Show package version
 */
const showVersion = (): void => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));
  console.log(packageJson.version);
};
