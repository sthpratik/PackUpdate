# [PackUpdate](https://sthpratik.github.io/PackUpdate/#/)

PackUpdate is a versatile tool designed to streamline and manage package updates efficiently. It is available as both a Node.js and Python package, catering to developers across different ecosystems.

## Features
- Easy package management.
- Automated update checks.
- Safe mode for testing updates before applying them.
- Comprehensive logging with unique timestamped log files.
- Quiet mode for background execution.
- Available for both Node.js and Python environments.

## Installation and Usage

### Node.js Package
PackUpdate is available as a global Node.js package named `updatepackages`. It helps developers update their Node.js project dependencies efficiently.

For detailed instructions, visit the [Node.js Package README](https://sthpratik.github.io/PackUpdate/#/./nodejs).

### Python Package
PackUpdate is also available as a Python package. It provides similar functionality for managing and updating Node.js project dependencies using Python.

For detailed instructions, visit the [Python Package README](https://sthpratik.github.io/PackUpdate/#/./python).

## New Features

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

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
