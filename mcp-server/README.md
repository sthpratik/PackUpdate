# PackUpdate MCP Server

An MCP (Model Context Protocol) server that provides intelligent package management with automatic log analysis and troubleshooting capabilities.

## Key Features

### 🧠 **Automatic Log Analysis**
- **Smart Context**: Every `update_packages` call automatically analyzes previous logs first
- **Issue Detection**: Identifies permission errors, network issues, dependency conflicts, test failures
- **Intelligent Recommendations**: Provides actionable suggestions based on log patterns
- **No Manual Steps**: AI gets full context without separate analysis commands

### 📦 **Advanced Package Management**
- **update_packages**: Update packages with auto-detection or specify Node.js/Python
- **list_outdated_packages**: Preview outdated packages without updating them
- **Auto-detection**: Automatically detects Node.js vs Python projects
- **Safe Updates**: Built-in safe mode with rollback capabilities
- **Selective Updates**: Minor-only updates to avoid breaking changes
- **Cleanup Tools**: Remove unused dependencies and deduplicate packages

### 🔧 **Troubleshooting & Analysis**
- **analyze_logs**: Dedicated tool to analyze multiple recent log files
- **fix_and_update**: Automated issue resolution with package updates
- **get_update_logs**: Retrieve latest log file contents
- **get_packupdate_version**: Check installed PackUpdate package versions

### 📊 **Progress & Monitoring**
- **Real-time Progress**: Live status updates visible in Q CLI logs
- **Comprehensive Reports**: Analysis + execution results + new logs in one response
- **Configurable Timeouts**: Shorter timeouts to avoid long waits
- **Verbose Mode**: Detailed logging via environment variables

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

## Example AI Workflow

1. **AI Request**: "Update packages for my project"
2. **Automatic Analysis**: MCP server analyzes previous logs for context
3. **Issue Detection**: Identifies network problems, test failures, breaking changes
4. **Intelligent Execution**: Applies appropriate flags (--minor-only, --safe-mode, etc.)
5. **Comprehensive Report**: Returns analysis + execution results + new logs

The AI gets full context about previous issues without needing separate commands, enabling smarter package management decisions.

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
