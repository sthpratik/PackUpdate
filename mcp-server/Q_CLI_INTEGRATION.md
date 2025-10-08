# Q CLI Integration Guide

## Setup Instructions

### 1. Install PackUpdate Packages

First, install the PackUpdate packages globally:

```bash
# Install Node.js version globally
npm install -g updatenpmpackages

# Install Python version (optional)
pip install packupdate
```

### 2. Install MCP Server Dependencies

Navigate to the MCP server directory and install dependencies:

```bash
cd /path/to/PackUpdate/mcp-server
npm install
```

### 3. Configure Q CLI

Add the MCP server to your Q CLI using the `/mcp` command:

```bash
/mcp add packupdate /absolute/path/to/PackUpdate/mcp-server/mcp.json
```

Or manually add to your Q CLI configuration:

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["/absolute/path/to/PackUpdate/mcp-server/index.js"],
      "cwd": "/absolute/path/to/PackUpdate/mcp-server"
    }
  }
}
```

**Important**: Use absolute paths in the configuration.

### 4. Verify Installation

Check if the MCP server is loaded:

```bash
/mcp
```

You should see `packupdate` listed without errors.

## Usage Examples

#### Update Packages (Auto-detect)
```
Update packages in /path/to/my-project
```

#### Update with Safe Mode
```
Update packages in /path/to/my-project using safe mode
```

#### Check Outdated Packages
```
Show me outdated packages in /path/to/my-project
```

#### Get Update Logs
```
Show me the latest PackUpdate logs for /path/to/my-project
```

## Available Tools

1. **update_packages** - Auto-detects project type and updates
2. **get_packupdate_version** - Shows installed versions
3. **get_update_logs** - Retrieves log file contents
4. **list_outdated_packages** - Preview outdated packages

## Troubleshooting

### MCP Server Fails to Load

1. Ensure absolute paths in configuration
2. Check Node.js dependencies are installed
3. Verify file permissions are correct
4. Use `Q_LOG_LEVEL=trace` for detailed error logs

### Common Issues

- **Connection closed**: Usually indicates path or dependency issues
- **Command not found**: PackUpdate packages not installed globally
- **Permission denied**: File permissions need adjustment
