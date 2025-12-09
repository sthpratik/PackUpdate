# MCP Server Quick Reference

## Installation

```bash
npm install -g packupdate-mcp-server
```

## Tools

### 1. update_packages
```json
{
  "project_path": "/path/to/project",
  "safe_mode": true,
  "minor_only": true,
  "passes": 2,
  "update_version": "minor"
}
```

### 2. update_packages_interactive
```json
{
  "project_path": "/path/to/project",
  "safe_mode": true
}
```

### 3. automate_updates_with_git
```json
{
  "platform": "bitbucket-server|github|gitlab",
  "repository": "workspace/repo",
  "endpoint": "https://server.com",
  "token": "your-token",
  "ticket_no": "JIRA-123",
  "safe_mode": true
}
```

### 4. get_packupdate_version
```json
{
  "package_manager": "both"
}
```

### 5. get_update_logs
```json
{
  "project_path": "/path/to/project"
}
```

### 6. analyze_logs
```json
{
  "project_path": "/path/to/project",
  "log_count": 3
}
```

### 7. fix_and_update
```json
{
  "project_path": "/path/to/project",
  "auto_fix": true
}
```

### 8. list_outdated_packages
```json
{
  "project_path": "/path/to/project"
}
```

## Natural Language (Q CLI)

```
"Update packages in /path/to/project with safe mode"
"Automate updates for myorg/myapp on GitHub"
"Interactively update packages"
"Analyze logs and fix issues"
```

## Environment Variables

```bash
export PACKUPDATE_VERBOSE=true
export PACKUPDATE_BITBUCKET_TOKEN=your-token
export PACKUPDATE_BITBUCKET_ENDPOINT=https://server.com
```

## Q CLI Config

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "packupdate-mcp"
    }
  }
}
```
