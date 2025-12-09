# Git Automation

PackUpdate includes powerful Git automation features that streamline the entire package update workflow. The automation handles repository cloning, branch creation, package updates, commit creation, and pull request generation.

## Overview

The automation workflow:
1. **Setup**: Clone repository to temporary workspace
2. **Branch**: Create feature branch from base branch (develop → master fallback)
3. **Install**: Install dependencies to ensure proper version detection
4. **Report**: Generate comprehensive security and dependency report
5. **Update**: Execute package updates with **automatic safe mode** (tests run after each update)
6. **Commit**: Stage changes and create descriptive commit with ticket linking
7. **Push**: Push feature branch to remote repository
8. **PR**: Create pull request with detailed logs and recommendations
9. **Cleanup**: Remove temporary workspace

**🛡️ Safety First**: Automation always runs in safe mode, ensuring tests and builds pass before committing any changes.

## SSH Key Setup

The automation features use SSH for git operations (clone, push) and API tokens for pull request creation. You need to set up SSH keys for authentication.

### Step 1: Generate SSH Key (if you don't have one)

```bash
# Generate a new SSH key
ssh-keygen -t rsa -b 4096 -C "your.email@company.com"

# When prompted, save it to default location (~/.ssh/id_rsa)
# Set a passphrase for security (optional but recommended)
```

### Step 2: Add SSH Key to SSH Agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key to the agent
ssh-add ~/.ssh/id_rsa

# For macOS, add to keychain (optional)
ssh-add --apple-use-keychain ~/.ssh/id_rsa
```

### Step 3: Add SSH Key to Bitbucket Server

1. **Copy your public key:**
   ```bash
   # Display and copy your public key
   cat ~/.ssh/id_rsa.pub
   ```

2. **Add to Bitbucket Server:**
   - Log into your Bitbucket Server
   - Go to **Personal Settings** (click your avatar → Manage account)
   - Click **SSH keys** in the left sidebar
   - Click **Add key**
   - Paste your public key content
   - Give it a descriptive label (e.g., "PackUpdate Automation")
   - Click **Add key**

### Step 4: Add SSH Key to GitHub (if using GitHub)

1. **Copy your public key:**
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

2. **Add to GitHub:**
   - Go to GitHub Settings → SSH and GPG keys
   - Click **New SSH key**
   - Paste your public key
   - Give it a title
   - Click **Add SSH key**

### Step 5: Add SSH Key to GitLab (if using GitLab)

1. **Copy your public key:**
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

2. **Add to GitLab:**
   - Go to GitLab User Settings → SSH Keys
   - Paste your public key in the **Key** field
   - Give it a title
   - Click **Add key**

### Step 6: Test SSH Connection

```bash
# Test Bitbucket Server connection
ssh -T git@your-bitbucket-server.com

# Test GitHub connection
ssh -T git@github.com

# Test GitLab connection
ssh -T git@gitlab.com
```

**Expected responses:**
- **Bitbucket Server**: Connection successful message
- **GitHub**: "Hi username! You've successfully authenticated..."
- **GitLab**: "Welcome to GitLab, @username!"

### Step 7: Configure SSH for Custom Ports (if needed)

If your Bitbucket Server uses a custom SSH port, create/edit `~/.ssh/config`:

```bash
# Edit SSH config
nano ~/.ssh/config
```

Add configuration:
```
Host your-bitbucket-server.com
    HostName your-bitbucket-server.com
    Port 7999
    User git
    IdentityFile ~/.ssh/id_rsa
```

### Troubleshooting SSH Issues

**Permission denied errors:**
```bash
# Check SSH key permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

**Connection timeout:**
```bash
# Test with verbose output
ssh -vT git@your-bitbucket-server.com
```

**Multiple SSH keys:**
```bash
# Generate specific key for work
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_work -C "work@company.com"

# Add to SSH config
Host work-bitbucket
    HostName your-bitbucket-server.com
    User git
    IdentityFile ~/.ssh/id_rsa_work
```

### Security Best Practices

1. **Use passphrases** on SSH keys
2. **Rotate keys regularly** (annually)
3. **Use separate keys** for different services
4. **Remove unused keys** from servers
5. **Monitor SSH key usage** in server logs

## Quick Start

### Bitbucket Server
```bash
# Basic automation
updatepkgs --automate \
  --platform bitbucket-server \
  --endpoint https://your-bitbucket-server.com \
  --token your-access-token \
  --repository WORKSPACE/repository \
  --ticket-no JIRA-456

# With reviewers and custom branch
updatepkgs --automate \
  --platform bitbucket-server \
  --repository WORKSPACE/webapp \
  --ticket-no PROJ-789 \
  --reviewers john.doe,jane.smith \
  --feature-branch feature/security-updates
```

### GitHub (SSH)
```bash
# GitHub automation
updatepkgs --automate \
  --platform github \
  --repository myorg/myapp \
  --ticket-no JIRA-123 \
  --minor-only

# With safe mode and multiple passes
updatepkgs --automate \
  --platform github \
  --repository myorg/webapp \
  --safe \
  --pass=3
```

## Command Line Options

### Required Flags
- `--automate` - Enable automation workflow
- `--platform=<type>` - Git platform (`bitbucket-server`, `github`, `gitlab`)
- `--repository=<repo>` - Repository in format `workspace/repo` or `org/repo`

### Platform-Specific Options
- `--endpoint=<url>` - Bitbucket server base URL (e.g., `https://your-bitbucket-server.com`)
- `--token=<token>` - Authentication token (required for bitbucket-server)

**Note**: For Bitbucket Server, provide only the base URL. The system automatically constructs the correct API paths (`/rest/api/1.0/...`) and clone URLs (`/scm/...`).

### Branch Management
- `--base-branch=<branch>` - Base branch (default: `develop`, fallback: `master`)
- `--feature-branch=<name>` - Custom feature branch name (default: auto-generated)

### Integration Options
- `--ticket-no=<ticket>` - Ticket number for commit messages and PR linking
- `--reviewers=<list>` - Comma-separated reviewers for pull request
- `--workspace-dir=<path>` - Temporary workspace directory (default: `./temp-updates`)

## Environment Variables

Set default values to avoid repeating common parameters:

```bash
# Bitbucket configuration
export PACKUPDATE_BITBUCKET_TOKEN="your-token-here"
export PACKUPDATE_BITBUCKET_ENDPOINT="https://your-bitbucket-server.com"

# General configuration
export PACKUPDATE_BASE_BRANCH="develop"
export PACKUPDATE_WORKSPACE_DIR="/tmp/package-updates"
export PACKUPDATE_REVIEWERS="john.doe,jane.smith"
```

Then use simplified commands:
```bash
updatepkgs --automate --platform bitbucket-server --repository WORKSPACE/repository
```

## Integration with Existing Features

All existing PackUpdate features work with automation (safe mode is automatically enabled):

```bash
# Minor-only updates (safe mode automatic)
updatepkgs --automate \
  --platform github \
  --repository myorg/app \
  --minor-only

# Multiple passes with cleanup (safe mode automatic)
updatepkgs --automate \
  --platform bitbucket-server \
  --repository WORKSPACE/webapp \
  --pass=3 \
  --remove-unused \
  --dedupe-packages

# Version bumping after updates (safe mode automatic)
updatepkgs --automate \
  --platform github \
  --repository myorg/api \
  --update-version=minor
```

**Note**: The `--safe` flag is automatically enabled for all automation workflows to ensure tests pass before committing changes.

## Pull Request Content

The automation generates comprehensive pull requests with:

### Title Format
```
[TICKET-123]: Package Updates - 5 packages updated
```

### Description Includes
- **Summary**: Updated and failed package counts
- **Updated Packages**: Detailed list with version changes
- **Failed Updates**: List of packages that couldn't be updated
- **Security Report**: Vulnerability and breaking change analysis
- **Recommendations**: Actionable next steps

### Example PR Description
```markdown
# Package Updates

**Ticket:** JIRA-456

## Summary
- **Updated Packages:** 3
- **Failed Updates:** 1
- **Total Outdated:** 8

## 📦 Updated Packages
- `@types/node`: 24.10.0 → 24.10.1
- `typescript`: 5.0.0 → 5.3.2
- `inquirer`: 9.2.0 → 9.3.8

## ❌ Failed Updates
- `some-broken-package`

## 🔒 Security Summary
- **Vulnerabilities:** 0
- **Safe Updates:** 2
- **Risky Updates:** 1

## 💡 Recommendations
- Consider updating outdated packages with --minor-only for safer updates
- 2 packages can be safely updated without breaking changes
- 1 packages may have breaking changes - review before updating

---
*Generated by PackUpdate automation*
```

## Workspace Management

### Unique Workspaces
Each automation run creates a unique workspace:
```
temp-updates/
├── workspace_repo1_2025-11-19T16-26-35/
├── myorg_webapp_2025-11-19T16-30-12/
└── workspace_api_2025-11-19T16-35-45/
```

### Parallel Execution
Multiple automation commands can run simultaneously without conflicts:
```bash
# Terminal 1
updatepkgs --automate --platform github --repository myorg/app1 &

# Terminal 2  
updatepkgs --automate --platform github --repository myorg/app2 &

# Terminal 3
updatepkgs --automate --platform bitbucket-server --repository WORKSPACE/app3 &
```

### Cleanup
Workspaces are automatically cleaned up after completion, even on failure.

## Platform Support

### Bitbucket Server
- ✅ Full automation support
- ✅ API-based PR creation
- ✅ Reviewer assignment
- ✅ Token authentication
- ✅ SSH for git operations

### GitHub
- ✅ Repository cloning via SSH
- ✅ Branch creation and pushing
- ⚠️ Manual PR creation (CLI tools coming soon)
- ✅ SSH key authentication

### GitLab
- ✅ Repository cloning via SSH  
- ✅ Branch creation and pushing
- ⚠️ Manual PR creation (CLI tools coming soon)
- ✅ SSH key authentication

## Error Handling

### Validation Errors
```bash
# Missing platform
updatepkgs --automate
# Error: Platform is required for automation (--platform)

# Missing repository
updatepkgs --automate --platform github
# Error: Repository is required for automation (--repository)

# Missing Bitbucket credentials
updatepkgs --automate --platform bitbucket-server --repository WORKSPACE/app
# Error: Bitbucket endpoint is required (--endpoint or PACKUPDATE_BITBUCKET_ENDPOINT)
```

### Runtime Errors
- **Clone failures**: Invalid repository or authentication issues
- **Branch conflicts**: Feature branch already exists
- **Update failures**: Package update errors (logged but don't stop workflow)
- **Push failures**: Network issues or permission problems

### Recovery
- Workspaces are always cleaned up
- Detailed error logs are preserved
- Failed updates are reported in PR description
- Partial updates are still committed and pushed

## Best Practices

### Security
- Use environment variables for tokens
- Rotate tokens regularly
- Use SSH keys for GitHub/GitLab
- Review generated PRs before merging

### Branch Management
- Use descriptive feature branch names
- Include ticket numbers for traceability
- Set appropriate base branches per project

### Automation Strategy
- Start with `--safe` mode for critical projects
- Use `--minor-only` for conservative updates
- Run `--generate-report` first to assess changes
- Set up reviewers for all automated PRs

### CI/CD Integration
```bash
# In your CI pipeline
updatepkgs --automate \
  --platform bitbucket-server \
  --repository $CI_PROJECT_PATH \
  --ticket-no $JIRA_TICKET \
  --quiet \
  --safe
```

## Troubleshooting

### Common Issues

**Authentication Failures**
```bash
# Check SSH key setup for GitHub/GitLab
ssh -T git@github.com

# Verify Bitbucket token
curl -H "Authorization: Bearer $TOKEN" $ENDPOINT/rest/api/1.0/projects
```

**Branch Creation Failures**
```bash
# Check if feature branch already exists
git ls-remote --heads origin feature/package-updates-*

# Use custom branch name
updatepkgs --automate --feature-branch feature/updates-$(date +%s)
```

**Package Update Failures**
```bash
# Run with verbose logging
updatepkgs --automate --repository myorg/app --quiet=false

# Check generated logs
ls -la temp-updates/*/logs/
```

### Debug Mode
```bash
# Enable detailed logging
export DEBUG=packupdate:*
updatepkgs --automate --platform github --repository myorg/app
```
