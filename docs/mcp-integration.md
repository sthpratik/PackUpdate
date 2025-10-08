# Q CLI Integration Guide

Complete guide for integrating PackUpdate MCP server with Amazon Q CLI, including progress logging setup.

## Quick Setup

### 1. Install PackUpdate MCP Server

#### Option A: NPM Package (Recommended)

```bash
# Install globally
npm install -g packupdate-mcp-server
```

#### Option B: Clone Repository

```bash
git clone https://github.com/sthpratik/PackUpdate.git
cd PackUpdate/mcp-server
npm install
```

### 2. Configure Q CLI

#### For NPM Installation

Add to `~/.aws/amazonq/mcp.json`:

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

#### For Repository Clone

Add to `~/.aws/amazonq/mcp.json`:

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["/path/to/PackUpdate/mcp-server/index.js"],
      "cwd": "/path/to/PackUpdate/mcp-server",
      "env": {
        "PACKUPDATE_VERBOSE": "true"
      }
    }
  }
}
```

### 3. Restart Q CLI

```bash
q chat
```

## Progress Logging Setup

### Enable Real-Time Feedback

The PackUpdate MCP server includes built-in progress logging to prevent operations from appearing to "hang". Here's how to enable it:

#### Method 1: Server-Specific Verbose Mode (Recommended)

```bash
PACKUPDATE_VERBOSE=true q chat
```

#### Method 2: Q CLI Trace Logging (All MCP Servers)

```bash
Q_LOG_LEVEL=trace q chat
```

#### Method 3: Monitor Logs in Separate Terminal

```bash
# Find your temp directory
echo $TMPDIR

# Watch Q CLI logs in real-time
tail -f $TMPDIR/qlog/qchat.log
```

### What You'll See

With verbose logging enabled, you'll see real-time updates like:

```
[PackUpdate MCP] 2025-10-08T22:04:52.123Z: Starting package update for: /path/to/project
[PackUpdate MCP] 2025-10-08T22:04:52.124Z: Auto-detecting project type...
[PackUpdate MCP] 2025-10-08T22:04:52.125Z: Detected project type: nodejs
[PackUpdate MCP] 2025-10-08T22:04:52.126Z: Executing command: updatenpmpackages /path/to/project
[PackUpdate MCP] 2025-10-08T22:04:57.127Z: Updating packages still running...
[PackUpdate MCP] 2025-10-08T22:05:02.128Z: Updating packages still running...
[PackUpdate MCP] 2025-10-08T22:05:05.129Z: Progress: Updated lodash from 4.17.20 to 4.17.21
[PackUpdate MCP] 2025-10-08T22:05:08.130Z: Updating packages completed with exit code: 0
[PackUpdate MCP] 2025-10-08T22:05:08.131Z: Getting latest log content...
[PackUpdate MCP] 2025-10-08T22:05:08.132Z: Looking for logs in: /path/to/project/logs
[PackUpdate MCP] 2025-10-08T22:05:08.133Z: Found 3 log files
[PackUpdate MCP] 2025-10-08T22:05:08.134Z: Reading latest log: packupdate-20251008-220452.log
```

## Available Tools

### update_packages

Update packages with progress tracking and timeout protection.

**Usage in Q CLI:**
```
Update the packages in my current project using safe mode
```

**Parameters:**
- `project_path` (required): Path to the project
- `package_manager` (optional): "nodejs", "python", or "auto" (default: "auto")  
- `safe_mode` (optional): Enable safe mode (default: false)
- `quiet_mode` (optional): Enable quiet mode (default: false)
- `passes` (optional): Number of update passes (default: 1)

**Timeout:** 60 seconds with progress updates every 5 seconds

### get_packupdate_version

Check installed PackUpdate versions quickly.

**Usage in Q CLI:**
```
Check what version of PackUpdate is installed
```

**Parameters:**
- `package_manager` (optional): "nodejs", "python", or "both" (default: "both")

**Timeout:** 5 seconds per version check

### list_outdated_packages

Preview outdated packages without updating.

**Usage in Q CLI:**
```
Show me which packages are outdated in my project
```

**Parameters:**
- `project_path` (required): Path to the project

**Timeout:** 10 seconds

### get_update_logs

Retrieve the latest PackUpdate log files.

**Usage in Q CLI:**
```
Show me the logs from the last package update
```

**Parameters:**
- `project_path` (required): Path to the project

## Troubleshooting

### MCP Server Won't Load

1. **Check configuration path:**
   ```bash
   # Verify the path exists
   ls -la /path/to/PackUpdate/mcp-server/index.js
   ```

2. **Check Q CLI MCP status:**
   ```bash
   # In Q CLI
   /mcp
   ```

3. **View detailed errors:**
   ```bash
   Q_LOG_LEVEL=trace q chat
   ```

### Operations Appear to Hang

1. **Enable verbose logging:**
   ```bash
   PACKUPDATE_VERBOSE=true q chat
   ```

2. **Check timeout settings:**
   - Version checks: 5 seconds
   - Package listing: 10 seconds  
   - Package updates: 60 seconds

3. **Monitor real-time logs:**
   ```bash
   tail -f $TMPDIR/qlog/qchat.log
   ```

### PackUpdate Not Found

1. **Install Node.js version:**
   ```bash
   npm install -g updatenpmpackages
   ```

2. **Install Python version:**
   ```bash
   pip install packupdate
   ```

3. **Verify installation:**
   ```bash
   updatenpmpackages --version
   ```

## Advanced Configuration

### Custom Timeouts

Modify timeouts in the MCP server code:

```javascript
// In index.js, update timeout values:
const result = await this.executeCommandWithProgress(
  command, 
  cmdArgs, 
  "Updating packages",
  120000  // 2 minutes instead of 1 minute
);
```

### Custom Environment Variables

Add custom environment variables to the MCP configuration:

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["/path/to/PackUpdate/mcp-server/index.js"],
      "cwd": "/path/to/PackUpdate/mcp-server",
      "env": {
        "PACKUPDATE_VERBOSE": "true",
        "NODE_ENV": "production",
        "CUSTOM_TIMEOUT": "90000"
      }
    }
  }
}
```

### Multiple Project Support

The MCP server supports multiple projects by specifying different `project_path` parameters:

```
Update packages in /path/to/project1 using safe mode
Update packages in /path/to/project2 using Python package manager
```

## Integration Examples

### Basic Package Update
```
Q: Update the packages in my current project
A: I'll update the packages in your current project using PackUpdate.
   [Calls update_packages with auto-detection]
```

### Safe Mode Update
```  
Q: Update packages safely in /path/to/my-app
A: I'll update the packages in safe mode to test updates before applying them.
   [Calls update_packages with safe_mode: true]
```

### Check Before Update
```
Q: Show me outdated packages first, then update them
A: I'll first check which packages are outdated, then update them.
   [Calls list_outdated_packages, then update_packages]
```

### Review Update Logs
```
Q: Show me what happened in the last package update
A: I'll retrieve the latest PackUpdate log files for you.
   [Calls get_update_logs]
```

## Performance Tips

1. **Use verbose logging during development** to understand operation timing
2. **Monitor log files** to identify slow operations  
3. **Use safe mode** for critical projects to test updates first
4. **Check outdated packages** before updating to see scope of changes
5. **Enable quiet mode** for automated scripts to reduce output

## Security Considerations

1. **Path validation**: The MCP server validates project paths exist
2. **Command injection protection**: All parameters are properly escaped
3. **Timeout protection**: All operations have maximum execution time
4. **Error handling**: Detailed errors without exposing system information
5. **Log file access**: Only reads PackUpdate-generated log files

This integration provides a seamless experience for package management through Q CLI with full visibility into operation progress.
