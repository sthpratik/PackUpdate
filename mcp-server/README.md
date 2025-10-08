# PackUpdate MCP Server

An MCP (Model Context Protocol) server that provides tools for updating Node.js packages using the PackUpdate packages.

## Features

- **update_packages**: Update packages with auto-detection or specify Node.js/Python
- **get_packupdate_version**: Check installed PackUpdate package versions
- **get_update_logs**: Retrieve and return the latest PackUpdate log file contents
- **list_outdated_packages**: Preview outdated packages without updating them
- **Progress logging**: Real-time status updates visible in Q CLI logs
- **Configurable timeouts**: Shorter timeouts to avoid long waits
- **Verbose mode**: Detailed logging via environment variables

## Installation

### Option 1: NPM Package (Recommended)

```bash
# Install globally
npm install -g packupdate-mcp-server

# Or install locally
npm install packupdate-mcp-server
```

### Option 2: Clone Repository

```bash
git clone https://github.com/sthpratik/PackUpdate.git
cd PackUpdate/mcp-server
npm install
```

## Quick Configuration

### For NPM Installation

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

### For Local Installation

Add to `~/.aws/amazonq/mcp.json`:

```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["/absolute/path/to/PackUpdate/mcp-server/index.js"],
      "cwd": "/absolute/path/to/PackUpdate/mcp-server",
      "env": {
        "PACKUPDATE_VERBOSE": "true"
      }
    }
  }
}
```

## Documentation

📖 **Complete documentation available at:** https://sthpratik.github.io/PackUpdate/#/

### Key Documentation Pages:

- **[MCP Server Setup](https://sthpratik.github.io/PackUpdate/#/./mcp-server)** - Complete MCP server documentation
- **[Q CLI Integration](https://sthpratik.github.io/PackUpdate/#/./mcp-integration)** - Step-by-step Q CLI setup with progress logging
- **[Progress Logging Guide](https://sthpratik.github.io/PackUpdate/#/./mcp-progress-logging)** - Implementation guide for MCP developers

## Enable Progress Logging

```bash
# Method 1: PackUpdate-specific verbose mode
PACKUPDATE_VERBOSE=true q chat

# Method 2: Q CLI trace logging (all MCP servers)
Q_LOG_LEVEL=trace q chat
```

## Requirements

- Node.js 18+ and npm
- PackUpdate packages: `npm install -g updatenpmpackages`
- Amazon Q CLI with MCP support

## Troubleshooting

If you encounter issues:

1. **Check the [Q CLI Integration Guide](https://sthpratik.github.io/PackUpdate/#/./mcp-integration)** for detailed setup
2. **Enable verbose logging** to see real-time progress
3. **Verify PackUpdate installation**: `updatenpmpackages --version`
4. **Check MCP server status**: Use `/mcp` command in Q CLI

For complete troubleshooting steps, see the [full documentation](https://sthpratik.github.io/PackUpdate/#/./mcp-integration?id=troubleshooting).
