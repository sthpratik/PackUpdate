# updatenpmpackages

updatenpmpackages is a personal project designed to streamline and manage package updates efficiently.

## Features
- Easy package management.
- Automated update checks.
- User-friendly interface.
- Safe mode for testing updates before applying them.
- Comprehensive logging with unique timestamped log files.
- Quiet mode for background execution.

## Installation
### As a Standalone Application - [Documentation](https://sthpratik.github.io/PackUpdate/#/)
1. Clone the repository: [Github](https://github.com/sthpratik/PackUpdate)
   ```bash
   git clone https://github.com/sthpratik/PackUpdate
   ```
2. Navigate to the project directory:
   ```bash
   cd PackUpdate/node
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### As a Global Package 
1. Install `updatenpmpackages` globally via npm:
   ```bash
   npm install -g updatenpmpackages
   ```
2. Run `updatenpmpackages` to update the node packages of your app:
   ```bash
   updatenpmpackages
   ```

## Usage
### Parameters
- `--safe`: Runs the updates in safe mode, ensuring tests are executed after each update.
- `--quiet`: Runs in quiet mode, suppressing detailed console output while maintaining full logging.
- `--pass=<number>`: Specifies the number of update passes to perform. Defaults to 1.
- `--version`: Shows the current version of the package.
- `--type`: Shows the package type (nodejs).
- `--help`: Shows help message with all available parameters.
- `<projectPath>`: Optional. Specifies the path to the project. Defaults to the current working directory.

**Note:** Parameters can be specified in any order. If no project path is provided, the current directory is used.

### Examples
#### Basic Usage
Navigate to your project directory and run:
```bash
updatenpmpackages
```

#### Safe Mode
To run updates in safe mode:
```bash
updatenpmpackages --safe
```

#### Quiet Mode
To run in background with minimal console output:
```bash
updatenpmpackages --quiet
```

#### Multiple Passes
To perform multiple update passes:
```bash
updatenpmpackages --pass=3
```

#### Combined Parameters
To run in safe mode with quiet output and multiple passes:
```bash
updatenpmpackages --safe --quiet --pass=2
```

#### Specify Project Path
To update a specific project:
```bash
updatenpmpackages /path/to/your/project --quiet
```

#### Check Version
To check the current version:
```bash
updatenpmpackages --version
```

#### Check Package Type
To check the package type:
```bash
updatenpmpackages --type
```

#### Show Help
To see all available options:
```bash
updatenpmpackages --help
```

### Logging
- **Automatic Logging**: Every run creates a unique timestamped log file (e.g., `packupdate-2025-10-08T11-35-03-140Z.log`)
- **Error Tracking**: All errors are logged with detailed information
- **Success Tracking**: Successful package updates are recorded with version details
- **Failed Updates**: Packages that fail to update are tracked and logged
- **Review**: Log files can be reviewed later for troubleshooting or analysis

### Detailed Workflow
1. **Check for Outdated Packages**: The tool uses `npm outdated` to identify outdated packages.
2. **Resolve Update Order**: Dependencies are resolved to ensure updates occur in the correct order.
3. **Update Packages**: Packages are updated to the latest or wanted versions based on the mode.
4. **Run Tests**: If in safe mode, the tool runs `npm run build` and `npm test` after each update.
5. **Logging**: All operations are logged to a timestamped file for later review.
6. **Summary**: A final summary is displayed, showing updated packages and any failures.

## Local Development

For testing local changes without publishing:

```bash
cd PackUpdate/node
npm run build
npm link
updatenpmpackages --version  # Test your changes
```

For detailed local development instructions, see [Local Development Guide](./local-development.md).

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
