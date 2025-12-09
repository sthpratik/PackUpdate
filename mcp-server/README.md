# PackUpdate MCP Server

MCP (Model Context Protocol) server for PackUpdate - enables AI assistants to manage package updates with full automation capabilities.

## Version 1.1.0

### New Features
- ✨ **Git Automation** - Full workflow from clone to PR creation
- ✨ **Interactive Mode** - Visual package selection
- ✨ **Version Management** - Auto-update project versions
- ✨ **Enhanced Options** - All CLI features available

## Installation

```bash
npm install -g packupdate-mcp-server
```

## Available Tools

### 1. update_packages
Update packages with comprehensive options.

**Parameters:**
- `project_path` (required) - Path to the project
- `package_manager` - nodejs|python|auto (default: auto)
- `safe_mode` - Enable safe mode with test validation
- `quiet_mode` - Minimal output
- `minor_only` - Skip major version updates
- `generate_report` - Generate security report only
- `remove_unused` - Clean up unused dependencies
- `dedupe_packages` - Remove duplicate dependencies
- `passes` - Number of update passes (default: 1)
- `update_version` - Update project version (major|minor|patch|x.y.z)

**Example:**
```json
{
  "project_path": "/path/to/project",
  "safe_mode": true,
  "minor_only": true,
  "passes": 2
}
```

### 2. update_packages_interactive
Interactively select packages to update with visual prompts.

**Parameters:**
- `project_path` (required) - Path to the project
- `package_manager` - nodejs|python|auto (default: auto)
- `safe_mode` - Enable safe mode (default: true)

**Example:**
```json
{
  "project_path": "/path/to/project",
  "safe_mode": true
}
```

### 3. automate_updates_with_git
Automate package updates with full Git workflow.

**Parameters:**
- `platform` (required) - bitbucket-server|github|gitlab
- `repository` (required) - workspace/repo or org/repo
- `endpoint` (optional) - Git server URL (can use env var PACKUPDATE_BITBUCKET_ENDPOINT or PACKUPDATE_ENDPOINT)
- `token` (optional) - Authentication token (can use env vars PACKUPDATE_*_TOKEN)
- `base_branch` (optional) - Base branch (default: develop)
- `feature_branch` (optional) - Custom feature branch name (auto-generated if not provided)
- `ticket_no` (optional) - Ticket number for commits and PR linking
- `reviewers` (optional) - Comma-separated list of reviewers
- `workspace_dir` (optional) - Temporary workspace directory
- `safe_mode` (optional) - Enable safe mode (default: true)
- `minor_only` (optional) - Skip major updates (default: false)
- `passes` (optional) - Number of update passes (default: 1)
- `package_manager` (optional) - nodejs|python|auto (default: auto)

**Example - Minimal (only required parameters):**
```json
{
  "platform": "github",
  "repository": "myorg/myapp"
}
```
*Note: Uses environment variables for authentication and default settings*

**Example - Bitbucket Server (with all options):**
```json
{
  "platform": "bitbucket-server",
  "repository": "WORKSPACE/myapp",
  "endpoint": "https://bitbucket.company.com",
  "token": "your-token",
  "ticket_no": "JIRA-123",
  "reviewers": "john.doe,jane.smith",
  "safe_mode": true,
  "minor_only": true
}
```

**Example - Bitbucket Server (using env vars):**
```bash
# Set environment variables
export PACKUPDATE_BITBUCKET_ENDPOINT="https://bitbucket.company.com"
export PACKUPDATE_BITBUCKET_TOKEN="your-token"
```
```json
{
  "platform": "bitbucket-server",
  "repository": "WORKSPACE/myapp",
  "ticket_no": "JIRA-123",
  "reviewers": "john.doe,jane.smith",
  "safe_mode": true
}
```

**Example - GitHub (with token):**
```json
{
  "platform": "github",
  "repository": "myorg/myapp",
  "token": "ghp_xxxxx",
  "base_branch": "main",
  "ticket_no": "123"
}
```

**Example - GitHub (using env vars):**
```bash
export PACKUPDATE_GITHUB_TOKEN="ghp_xxxxx"
```
```json
{
  "platform": "github",
  "repository": "myorg/myapp",
  "base_branch": "main",
  "ticket_no": "123"
}
```

**Example - GitLab (using env vars):**
```bash
export PACKUPDATE_GITLAB_TOKEN="glpat-xxxxx"
export PACKUPDATE_ENDPOINT="https://gitlab.company.com"
```
```json
{
  "platform": "gitlab",
  "repository": "mygroup/myapp"
}
```

### 4. get_packupdate_version
Get installed PackUpdate versions.

**Parameters:**
- `package_manager` - nodejs|python|both (default: both)

### 5. get_update_logs
Get the latest PackUpdate log file contents.

**Parameters:**
- `project_path` (required) - Path to the project
- `detailed` - Get detailed logs (default: false)

### 6. analyze_logs
Analyze PackUpdate logs for issues and provide recommendations.

**Parameters:**
- `project_path` (required) - Path to the project
- `log_count` - Number of recent logs to analyze (default: 3)

### 7. fix_and_update
Analyze logs, fix identified issues, and attempt updates.

**Parameters:**
- `project_path` (required) - Path to the project
- `auto_fix` - Automatically apply fixes (default: true)
- `safe_mode` - Enable safe mode (default: true)

### 8. list_outdated_packages
List outdated packages without updating.

**Parameters:**
- `project_path` (required) - Path to the project

## Configuration

### Q CLI Integration

Add to your Q CLI configuration (`~/.qcli/config.json`):

**Basic Configuration:**
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "packupdate-mcp",
      "env": {
        "PACKUPDATE_VERBOSE": "true"
      }
    }
  }
}
```

**With Git Credentials (Recommended):**
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "packupdate-mcp",
      "env": {
        "PACKUPDATE_VERBOSE": "true",
        "PACKUPDATE_BITBUCKET_ENDPOINT": "https://bitbucket.company.com",
        "PACKUPDATE_BITBUCKET_TOKEN": "your-bitbucket-token",
        "PACKUPDATE_GITHUB_TOKEN": "ghp_your-github-token",
        "PACKUPDATE_GITLAB_TOKEN": "glpat-your-gitlab-token",
        "PACKUPDATE_BASE_BRANCH": "develop",
        "PACKUPDATE_REVIEWERS": "john.doe,jane.smith"
      }
    }
  }
}
```

**Security Note:** Store tokens securely. Consider using a secrets manager or environment variables from your shell profile instead of hardcoding in config files.

### Environment Variables

**Logging:**
- `PACKUPDATE_VERBOSE` - Enable verbose logging (default: true)

**Git Authentication (used as fallbacks if not provided in request):**
- `PACKUPDATE_TOKEN` - Generic authentication token (works for all platforms)
- `PACKUPDATE_BITBUCKET_TOKEN` - Bitbucket-specific token
- `PACKUPDATE_GITHUB_TOKEN` - GitHub-specific token  
- `PACKUPDATE_GITLAB_TOKEN` - GitLab-specific token

**Git Configuration:**
- `PACKUPDATE_ENDPOINT` - Generic Git server endpoint
- `PACKUPDATE_BITBUCKET_ENDPOINT` - Bitbucket server endpoint
- `PACKUPDATE_BASE_BRANCH` - Default base branch
- `PACKUPDATE_REVIEWERS` - Default reviewers (comma-separated)

**Priority:** Request parameters > Platform-specific env vars > Generic env vars

## Usage Examples

### Basic Package Update
```
Update packages in /path/to/project with safe mode enabled
```

### Interactive Update
```
Interactively update packages in /path/to/project
```

### Git Automation - Bitbucket
```
Automate package updates for WORKSPACE/myapp on Bitbucket Server at https://bitbucket.company.com with ticket JIRA-123
```

### Git Automation - GitHub
```
Automate package updates for myorg/myapp on GitHub with minor updates only
```

### Analyze and Fix
```
Analyze logs for /path/to/project and automatically fix issues
```

## Workflow Examples

### Complete Automation Workflow

1. **Clone Repository**
   ```
   Automate updates for myorg/myapp on GitHub
   ```

2. **Analyze Dependencies**
   - Detects outdated packages
   - Identifies breaking changes
   - Prioritizes safe updates

3. **Update Packages**
   - Tries latest version
   - Falls back to wanted version
   - Reverts on failure

4. **Run Tests**
   - Validates each update
   - Ensures no regressions

5. **Create PR**
   - Commits changes
   - Pushes to feature branch
   - Creates pull request with details

### Interactive Workflow

1. **List Outdated**
   ```
   List outdated packages in /path/to/project
   ```

2. **Interactive Selection**
   ```
   Interactively update packages in /path/to/project
   ```

3. **Review Changes**
   - Select specific packages
   - Choose update strategy
   - Confirm updates

## Features

### Smart Update Algorithm
- Latest → Wanted → Revert strategy
- Automatic test validation
- Safe rollback on failure

### Breaking Change Detection
- Analyzes major version changes
- Identifies peer dependency conflicts
- Provides recommendations

### Git Automation
- Supports Bitbucket Server, GitHub, GitLab
- Automatic branch creation
- PR creation with detailed description
- Reviewer assignment

### Progress Logging
- Real-time progress updates
- Detailed execution logs
- Automatic log analysis

### Error Recovery
- Automatic issue detection
- Smart fix recommendations
- Auto-fix capabilities

## Security Best Practices

### Token Management

**Recommended Approach - Environment Variables:**
```bash
# In your shell profile (~/.zshrc, ~/.bashrc, etc.)
export PACKUPDATE_GITHUB_TOKEN="ghp_xxxxx"
export PACKUPDATE_BITBUCKET_TOKEN="your-token"
export PACKUPDATE_BITBUCKET_ENDPOINT="https://bitbucket.company.com"
```

**Q CLI Configuration (Recommended):**
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "packupdate-mcp",
      "env": {
        "PACKUPDATE_GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "PACKUPDATE_BITBUCKET_TOKEN": "${BITBUCKET_TOKEN}"
      }
    }
  }
}
```

**Not Recommended - Hardcoding in Requests:**
```json
{
  "token": "hardcoded-token"  // ❌ Avoid this
}
```

### Token Permissions

**GitHub:**
- `repo` - Full repository access
- `workflow` - Update GitHub Actions workflows

**Bitbucket Server:**
- Repository write access
- Pull request creation

**GitLab:**
- `api` - Full API access
- `write_repository` - Push to repository

### Minimal Example (Secure)

With environment variables configured:
```json
{
  "platform": "github",
  "repository": "myorg/myapp"
}
```

All authentication handled via environment variables - no secrets in requests!

## Troubleshooting

### MCP Server Not Starting
```bash
# Check installation
npm list -g packupdate-mcp-server

# Reinstall
npm install -g packupdate-mcp-server
```

### Verbose Logging
```bash
# Enable verbose mode
export PACKUPDATE_VERBOSE=true
packupdate-mcp
```

### Git Authentication Issues
- Ensure token has required permissions
- Check endpoint URL format
- Verify repository access

## Development

### Running Locally
```bash
cd mcp-server
npm install
node index.js
```

### Testing
```bash
# Test basic functionality
node test-mcp.js

# Test with verbose logging
node test-verbose.js
```

## Documentation

- [MCP Server Setup](https://sthpratik.github.io/PackUpdate/#/./mcp-server)
- [Q CLI Integration](https://sthpratik.github.io/PackUpdate/#/./mcp-integration)
- [Progress Logging](https://sthpratik.github.io/PackUpdate/#/./mcp-progress-logging)
- [Automation Guide](https://sthpratik.github.io/PackUpdate/#/./automation)

## License

MIT

## Author

Manish Shrestha

## Repository

https://github.com/sthpratik/PackUpdate
