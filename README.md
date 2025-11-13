# [PackUpdate](https://sthpratik.github.io/PackUpdate/#/)

PackUpdate is a versatile tool designed to streamline and manage package updates efficiently. It is available as both a Node.js and Python package, catering to developers across different ecosystems.

## 🚀 Get Started

**Quick Start:**
- **Node.js**: `npm install -g updatenpmpackages` → `updatepkgs --help`
- **Python**: `pip install packUpdate` → `packUpdate --help`
- **Documentation**: [https://sthpratik.github.io/PackUpdate/#/](https://sthpratik.github.io/PackUpdate/#/)

## Features
- Easy package management with modular architecture
- Automated update checks with dependency resolution
- Safe mode for testing updates before applying them
- Comprehensive logging with unique timestamped log files
- Quiet mode for background execution
- Security and dependency reporting
- Minor-only updates for safer incremental changes
- Available for both Node.js and Python environments

## Architecture

PackUpdate features a **modular, KISS-compliant architecture** with comprehensive safety mechanisms and AI integration capabilities.

### Node.js Structure
```
src/
├── types.ts              # Type definitions
├── updatePackages.ts     # Main entry point
├── utils/                # Utility modules
│   ├── logger.ts         # Logging utilities
│   ├── version.ts        # Version comparison
│   └── cli.ts           # CLI argument parsing
└── services/            # Business logic modules
    ├── packageService.ts    # NPM operations
    ├── dependencyService.ts # Dependency analysis
    ├── testService.ts      # Test execution
    ├── reportService.ts    # Report generation
    └── updateService.ts    # Update orchestration
```

### Python Structure
```
packUpdate/
├── main.py              # Entry point
├── updatePackages.py    # Main application
├── utils/               # Utility modules
│   ├── logger.py        # Logging utilities
│   ├── version.py       # Version comparison
│   └── cli.py          # CLI argument parsing
└── services/           # Business logic modules
    ├── package_service.py  # NPM operations
    └── report_service.py   # Report generation
```

For detailed architectural diagrams and system design, visit the [Architecture Documentation](https://sthpratik.github.io/PackUpdate/#/./architecture).

## Installation and Usage

### Node.js Package
PackUpdate is available as a global Node.js package named `updatepackages`. It helps developers update their Node.js project dependencies efficiently.

For detailed instructions, visit the [Node.js Package README](https://sthpratik.github.io/PackUpdate/#/./nodejs).

### Python Package
PackUpdate is also available as a Python package. It provides similar functionality for managing and updating Node.js project dependencies using Python.

For detailed instructions, visit the [Python Package README](https://sthpratik.github.io/PackUpdate/#/./python).

### MCP Server
PackUpdate includes an MCP (Model Context Protocol) server that allows AI assistants to update packages automatically with real-time progress logging.

For setup and usage instructions, visit the [MCP Server Documentation](https://sthpratik.github.io/PackUpdate/#/./mcp-server).

For Q CLI integration with progress logging, see the [MCP Integration Guide](https://sthpratik.github.io/PackUpdate/#/./mcp-integration).

## New Features

### Maintenance Automation
- **`--remove-unused`**: Clean up unused dependencies
- **`--dedupe-packages`**: Remove duplicate dependencies
- **Intelligent Detection**: Uses depcheck for accurate unused package analysis
- **Safe Removal**: Conservative approach with fallback analysis
- **Dependency Optimization**: Reduces node_modules size and complexity

### Version-Specific Updates
- **`--minor-only`**: Update only minor versions (1.2.x → 1.3.x, skip major updates)
- **Safe Updates**: Avoid potentially breaking major version changes
- **Incremental Migration**: Allows gradual updates without major refactoring

### Comprehensive Reporting
- **`--generate-report`**: Generate detailed security & dependency analysis
- **Vulnerability Detection**: Identify packages with known security issues
- **Dependency Intelligence**: Analyze dependency trees and detect circular dependencies
- **Breaking Change Detection**: Scan for potential breaking changes and major version updates
- **API Compatibility**: Check peer dependencies and compatibility issues
- **Migration Guidance**: Identify packages requiring migration planning
- **Safe-First Updates**: Automatically prioritize packages without breaking changes
- **Actionable Recommendations**: Get specific guidance on next steps

### Logging
- **Automatic Log Files**: Every run creates a unique timestamped log file
- **Error Tracking**: All errors are captured with detailed information
- **Success Tracking**: Successful updates are logged with version details
- **Failed Package Tracking**: Packages that fail to update are recorded
- **Review Capability**: Log files can be processed later for analysis

### Quiet Mode
- **Background Execution**: Run with `--quiet` flag for minimal console output
- **Full Logging Maintained**: Detailed logs still written to file
- **Clean Console**: Only shows critical errors and log file location
- **Automation Friendly**: Perfect for CI/CD pipelines and automated scripts

## Code Quality & Maintainability

### KISS Principles Applied
- **Modular Architecture**: Large functions broken into focused, testable modules
- **Single Responsibility**: Each module has one clear purpose
- **Clear Documentation**: Comprehensive code comments and documentation
- **Easy Debugging**: Issues can be isolated to specific modules

### Developer Experience
- **TypeScript Support**: Full type safety in Node.js version
- **Easy Testing**: Each service can be unit tested independently
- **Clear Dependencies**: Import structure shows module relationships
- **Extensible Design**: New features can be added without touching existing code

For detailed refactoring information, see [Refactoring Documentation](./REFACTORING_DOCUMENTATION.md).

## Contributing
Contributions are welcome! The modular architecture makes it easy to add new features:

1. Fork the repository
2. Create a feature branch
3. Add your feature as a new service module
4. Include comprehensive tests and documentation
5. Submit a pull request

## License
This project is licensed under the MIT License.
