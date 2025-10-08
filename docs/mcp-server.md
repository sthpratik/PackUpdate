# PackUpdate MCP Server

The PackUpdate MCP (Model Context Protocol) server provides AI assistants with tools to update Node.js packages using the installed PackUpdate packages.

## Overview

The MCP server allows AI assistants like Q CLI to:
- Update packages automatically with safety checks
- Check installed PackUpdate versions
- Retrieve update logs for analysis
- Preview outdated packages before updating

## Installation

### 1. Install PackUpdate Packages

First, install the PackUpdate packages:

```bash
# Install Node.js version globally
npm install -g updatenpmpackages

# Install Python version (optional)
pip install packupdate
```

### 2. Get the MCP Server

#### Option A: Clone the Repository
```bash
git clone https://github.com/sthpratik/PackUpdate.git
cd PackUpdate/mcp-server
npm install
```

#### Option B: Download MCP Server Files
If you only need the MCP server, download these files to a directory:
- `package.json`
- `index.js` 
- `mcp.json`

Then install dependencies:
```bash
cd your-mcp-server-directory
npm install
```

### 3. Note the Installation Path
Remember the full path to your MCP server directory, you'll need it for configuration:
```bash
pwd  # Shows current directory path
# Example output: /Users/username/PackUpdate/mcp-server
```

## Configuration

### For Q CLI

Add the MCP server using the `/mcp` command or manual configuration:

#### Option A: Using Q CLI Command (Recommended)
```bash
/mcp add packupdate /FULL/PATH/TO/YOUR/PackUpdate/mcp-server/mcp.json
```

#### Option B: Manual Configuration
Add to your Q CLI configuration file:

**Location:** `~/.config/q/config.json` (or your Q CLI config location)

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["/FULL/PATH/TO/YOUR/PackUpdate/mcp-server/index.js"],
      "cwd": "/FULL/PATH/TO/YOUR/PackUpdate/mcp-server"
    }
  }
}
```

**Important:** 
- Use absolute paths (not relative paths like `./` or `~/`)
- Replace `/FULL/PATH/TO/YOUR/PackUpdate/mcp-server` with the actual path
- Ensure the `mcp.json` file has the correct absolute paths

#### Verify Installation
Check if the MCP server is loaded correctly:
```bash
/mcp
```

You should see `packupdate` listed without errors.

### Example Configurations

#### If you cloned to your home directory:
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node", 
      "args": ["/Users/john/PackUpdate/mcp-server/index.js"],
      "cwd": "/Users/john/PackUpdate/mcp-server"
    }
  }
}
```

#### If you cloned to a projects directory:
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["/Users/john/projects/PackUpdate/mcp-server/index.js"], 
      "cwd": "/Users/john/projects/PackUpdate/mcp-server"
    }
  }
}
```

### For Other MCP Clients

Use the standard MCP configuration format:

```json
{
  "command": "node",
  "args": ["index.js"],
  "cwd": "/path/to/PackUpdate/mcp-server"
}
```

## Available Tools

### 1. update_packages

Updates packages with automatic project type detection.

**Parameters:**
- `project_path` (required): Path to the project
- `package_manager` (optional): "nodejs", "python", or "auto" (default: "auto")
- `safe_mode` (optional): Enable safe mode testing (default: false)
- `quiet_mode` (optional): Suppress detailed output (default: false)
- `passes` (optional): Number of update passes (default: 1)

### 2. get_packupdate_version

Check installed PackUpdate package versions.

**Parameters:**
- `package_manager` (optional): "nodejs", "python", or "both" (default: "both")

### 3. get_update_logs

Retrieve the latest PackUpdate log file contents.

**Parameters:**
- `project_path` (required): Path to the project containing logs

### 4. list_outdated_packages

Preview outdated packages without updating them.

**Parameters:**
- `project_path` (required): Path to the project

## Usage Examples

### With Q CLI

Once configured, you can use natural language commands:

```
"Update packages in my project at /path/to/my-project"
"Check what packages are outdated in /path/to/my-project"
"Update packages using safe mode and quiet mode"
"Show me the logs from the last package update"
"What versions of PackUpdate are installed?"
"Update packages with 2 passes in safe mode"
```

### Direct MCP Calls

```javascript
// Update packages with auto-detection
await callTool("update_packages", {
  project_path: "/path/to/my-project",
  safe_mode: true,
  quiet_mode: true
});

// Force specific package manager
await callTool("update_packages", {
  project_path: "/path/to/my-project", 
  package_manager: "nodejs",
  passes: 2
});

// Check versions
await callTool("get_packupdate_version", {
  package_manager: "both"
});

// Preview outdated packages
await callTool("list_outdated_packages", {
  project_path: "/path/to/my-project"
});

// Get logs
await callTool("get_update_logs", {
  project_path: "/path/to/my-project"
});
```

## Features

### Auto-Detection

The server automatically detects project type:
- Looks for `package.json` → Node.js project
- Looks for `requirements.txt` or `pyproject.toml` → Python project  
- Defaults to Node.js if unclear

### Comprehensive Logging

All operations are logged with:
- Timestamped entries
- Package update details (old → new versions)
- Error tracking and failed packages
- Session information

### Safe Mode

When enabled:
- Tests packages after each update
- Reverts on test failures
- Ensures project stability

## Troubleshooting

### Common Issues

**"Connection closed: initialize response" errors:**
1. Ensure absolute paths are used in configuration (not relative paths)
2. Verify the MCP server dependencies are installed:
```bash
cd /your/path/to/PackUpdate/mcp-server
npm install
```
3. Check file permissions and Node.js access
4. Use `Q_LOG_LEVEL=trace` for detailed error logs

**"Package not installed" errors:**
```bash
# Verify installations
npm list -g updatenpmpackages
pip show packupdate
```

**"Cannot find MCP server" errors:**
1. Verify the path in your configuration:
```bash
# Check if the path exists
ls -la /your/configured/path/to/mcp-server
# Should show: index.js, package.json, node_modules/
```

2. Verify Node.js can run the server:
```bash
cd /your/configured/path/to/mcp-server
node index.js
# Should start without errors (Ctrl+C to exit)
```

**"No logs found" errors:**
- Ensure the project has been updated at least once
- Check that logs directory exists in the project

**MCP server not responding:**
- Verify the server path in configuration matches actual location
- Check that Node.js and npm are available in PATH
- Ensure MCP server dependencies are installed (`npm install` in mcp-server directory)
- Try using absolute paths instead of relative paths

### Testing the Server

Test the MCP server directly:

```bash
cd /your/path/to/PackUpdate/mcp-server
node test-mcp.js
```

Expected output:
```
Tools available: [
  'update_packages',
  'get_packupdate_version', 
  'get_update_logs',
  'list_outdated_packages'
]
```

### Quick Setup Verification

1. **Check PackUpdate packages are installed:**
```bash
updatenpmpackages --version  # Should show version number
```

2. **Check MCP server files exist:**
```bash
ls -la /your/mcp/server/path/
# Should show: index.js, package.json, node_modules/
```

3. **Test MCP server runs:**
```bash
cd /your/mcp/server/path/
node index.js
# Press Ctrl+C to exit after seeing startup message
```

## Integration Benefits

- **Seamless Workflow**: Update packages directly from AI conversations
- **Safety First**: Built-in testing and rollback capabilities
- **Comprehensive Logging**: Full audit trail of all changes
- **Flexible Options**: Support for different update strategies
- **Multi-Language**: Works with both Node.js and Python implementations

## Security Considerations

- The MCP server executes npm commands with user permissions
- Always review update logs before deploying to production
- Use safe mode for critical projects
- Consider running in isolated environments for untrusted projects
