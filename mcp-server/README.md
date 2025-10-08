# PackUpdate MCP Server

An MCP (Model Context Protocol) server that provides tools for updating Node.js packages using the PackUpdate packages.

## Features

- **update_packages**: Update packages with auto-detection or specify Node.js/Python
- **get_packupdate_version**: Check installed PackUpdate package versions
- **get_update_logs**: Retrieve and return the latest PackUpdate log file contents
- **list_outdated_packages**: Preview outdated packages without updating them

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure PackUpdate packages are installed:
```bash
# For Node.js version
npm install -g updatenpmpackages

# For Python version  
pip install packupdate
```

## Usage

### Running the MCP Server

```bash
npm start
```

### Available Tools

#### update_packages
Updates packages with auto-detection or specified package manager.

**Parameters:**
- `project_path` (required): Path to the project
- `package_manager` (optional): "nodejs", "python", or "auto" (default: "auto")
- `safe_mode` (optional): Enable safe mode (default: false)
- `quiet_mode` (optional): Enable quiet mode (default: false)  
- `passes` (optional): Number of update passes (default: 1)

#### get_packupdate_version
Check installed PackUpdate package versions.

**Parameters:**
- `package_manager` (optional): "nodejs", "python", or "both" (default: "both")

#### get_update_logs
Retrieves the latest PackUpdate log file contents.

**Parameters:**
- `project_path` (required): Path to the project to find logs

#### list_outdated_packages
Lists outdated packages without updating them.

**Parameters:**
- `project_path` (required): Path to the project

## Integration with Q CLI

Add this server to your Q CLI configuration:

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "/path/to/PackUpdate/mcp-server"
    }
  }
}
```

## Example Usage

```javascript
// Auto-detect and update packages
await callTool("update_packages", {
  project_path: "/path/to/my-project",
  safe_mode: true
});

// Force use Node.js version
await callTool("update_packages", {
  project_path: "/path/to/my-project",
  package_manager: "nodejs",
  quiet_mode: true
});

// Check versions
await callTool("get_packupdate_version", {
  package_manager: "both"
});

// Check outdated packages first
await callTool("list_outdated_packages", {
  project_path: "/path/to/my-project"
});
```
