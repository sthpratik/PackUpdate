---
inclusion: always
---

# Project Structure

## Repository Layout

```
PackUpdate/
├── node/                    # Node.js/TypeScript implementation
├── python/                  # Python implementation
├── mcp-server/             # MCP protocol server for AI integration
├── docs/                   # Docsify documentation site
├── specs/                  # Feature specifications and implementation docs
├── examples/               # Usage examples and automation scripts
├── logs/                   # Root-level log files
└── temp-updates/           # Temporary workspaces for automation
```

## Node.js Package (`/node`)

```
node/
├── src/
│   ├── updatePackages.ts        # Main entry point & CLI orchestration
│   ├── types.ts                 # TypeScript type definitions
│   ├── utils/
│   │   ├── logger.ts           # Dual logging (summary + detailed)
│   │   ├── version.ts          # Version comparison utilities
│   │   └── cli.ts              # CLI argument parsing
│   └── services/
│       ├── packageService.ts    # NPM operations
│       ├── updateService.ts     # Smart update algorithm
│       ├── dependencyService.ts # Dependency resolution
│       ├── testService.ts       # Build/test execution
│       ├── reportService.ts     # Security & dependency reports
│       ├── cleanupService.ts    # Package cleanup & deduplication
│       ├── automationService.ts # Git workflow automation
│       ├── interactiveService.ts # Interactive package selection
│       └── versionService.ts    # Project version management
├── dist/                        # Compiled JavaScript output
├── logs/                        # Package-specific logs
├── temp-updates/               # Temporary automation workspaces
├── package.json
├── tsconfig.json
└── test-local.sh
```

## Python Package (`/python`)

```
python/
├── packUpdate/
│   ├── __init__.py
│   ├── updatePackages.py       # Main application logic
│   ├── utils/
│   │   ├── logger.py          # Logging utilities
│   │   ├── version.py         # Version comparison
│   │   └── cli.py             # CLI parsing
│   └── services/
│       ├── package_service.py  # NPM operations
│       ├── report_service.py   # Report generation
│       ├── automation_service.py # Git automation
│       ├── interactive_service.py # Interactive selection
│       ├── version_service.py  # Version management
│       └── cleanup_service.py  # Package cleanup
├── main.py                     # Entry point
├── setup.py                    # Package configuration
├── logs/                       # Package-specific logs
└── temp-updates/              # Temporary automation workspaces
```

## MCP Server (`/mcp-server`)

```
mcp-server/
├── index.js                    # MCP protocol implementation
├── test-mcp.js                # MCP server testing
├── test-verbose.js            # Verbose logging tests
├── package.json
└── logs/                      # MCP-specific logs
```

## Documentation (`/docs`)

```
docs/
├── index.html                 # Docsify entry point
├── README.md                  # Home page
├── _sidebar.md               # Navigation sidebar
├── _navbar.md                # Top navigation
├── _coverpage.md             # Landing page cover
├── architecture.md           # System architecture
├── automation.md             # Git automation guide
├── features.md               # Feature documentation
├── nodejs.md                 # Node.js package docs
├── python.md                 # Python package docs
├── mcp-server.md            # MCP server setup
├── mcp-integration.md       # Q CLI integration
└── mcp-progress-logging.md  # Progress logging guide
```

## Specifications (`/specs`)

Feature design documents and implementation summaries:
- `BREAKING_CHANGE_DETECTION.md` - Breaking change analysis spec
- `CLEANUP_FEATURES.md` - Cleanup functionality spec
- `MINOR_ONLY_IMPLEMENTATION.md` - Minor-only updates spec
- `REPORT_GENERATION_IMPLEMENTATION.md` - Reporting spec
- `REFACTORING_DOCUMENTATION.md` - Architecture refactoring

## Key Conventions

### Service Module Pattern
All business logic lives in service modules with clear responsibilities:
- **Package Service**: NPM command execution
- **Update Service**: Update orchestration and smart algorithms
- **Test Service**: Build and test validation
- **Report Service**: Analysis and reporting
- **Automation Service**: Git workflow automation
- **Cleanup Service**: Dependency optimization

### Logging Strategy
- **Summary Logs**: `packupdate-TIMESTAMP.log` - High-level events
- **Detailed Logs**: `packupdate-detailed-TIMESTAMP.log` - Full command output
- **Security Reports**: `security-report-TIMESTAMP.json` - Vulnerability data
- **Location**: `logs/` directory in each package

### Workspace Isolation
Automation creates unique temporary workspaces:
- **Format**: `temp-updates/{workspace}_{repo}_{timestamp}/`
- **Purpose**: Parallel execution without conflicts
- **Cleanup**: Automatic removal after completion

### Cross-Platform Parity
Node.js and Python implementations maintain identical:
- CLI flags and behavior
- Service module structure
- Log formats
- Feature functionality

## File Naming

- **TypeScript**: camelCase for files (e.g., `updatePackages.ts`)
- **Python**: snake_case for files (e.g., `update_packages.py`)
- **Documentation**: kebab-case for markdown (e.g., `mcp-integration.md`)
- **Scripts**: kebab-case for shell scripts (e.g., `test-local.sh`)

## When Adding Features

1. Implement in both Node.js (`/node/src/services/`) and Python (`/python/packUpdate/services/`)
2. Add corresponding documentation in `/docs/`
3. Update CLI help text in `utils/cli.ts` and `utils/cli.py`
4. Add tests or examples in `/examples/`
5. Consider MCP server integration if AI-relevant
