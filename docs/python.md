# PackUpdate

PackUpdate is a Python utility designed to help developers manage and update their Node.js project dependencies efficiently. It ensures that package updates are validated through tests and resolves audit issues automatically. The tool prioritizes updating packages to their latest versions, but if issues are detected, it falls back to updating to the "wanted" version.

## Features

- **Update Packages**: Updates Node.js project dependencies to their latest versions if no issues are detected.
- **Fallback to Wanted Version**: If issues arise during testing, updates packages to the "wanted" version instead.
- **Audit Fix**: Automatically resolves audit issues in the project.
- **Validation**: Runs tests to ensure package updates do not introduce breaking changes.
- **Comprehensive Logging**: Creates unique timestamped log files for every run.
- **Quiet Mode**: Runs in background with minimal console output while maintaining full logging.

## Prerequisites

- Python (v3.8 or higher)
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

Install the library using pip:

```bash
pip install packupdate
```

## Usage

Run the CLI tool to update Node.js project dependencies:

```bash
updatenpmpackages <project_path> [--safe] [--quiet] [--pass=N]
```

### Parameters

- `<project_path>`: The path to the Node.js project directory containing `package.json`.
- `--safe`: Enables safe mode with comprehensive testing and fallback.
- `--quiet`: Runs in quiet mode, suppressing detailed console output while maintaining full logging.
- `--pass=N`: Specifies the number of update passes to perform. Default is 1.

### Examples

- Basic Update:
  ```bash
  updatenpmpackages /path/to/project
  ```

- Safe Mode:
  ```bash
  updatenpmpackages /path/to/project --safe
  ```

- Quiet Mode:
  ```bash
  updatenpmpackages /path/to/project --quiet
  ```

- Multiple Passes:
  ```bash
  updatenpmpackages /path/to/project --pass=3
  ```

- Combined Parameters:
  ```bash
  updatenpmpackages /path/to/project --safe --quiet --pass=2
  ```

## Run using code
Clone the repository to your local machine:

```bash
git clone <repository-url>
cd PackUpdate/python
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### 1. Run the Update Process

To update the packages in your Node.js project, use the following command:

```bash
python updatePackages.py <project_path> [--safe] [--quiet] [--pass=N]
```

### 2. Available Commands and Options

- `<project_path>`: **(Required)** The path to the Node.js project directory containing `package.json` and `package-lock.json`.

- `--safe`: **(Optional)** Enables safe mode. In this mode:
  - The script first attempts to update packages to their latest versions.
  - If tests fail, it reverts to the "wanted" version.
  - If tests fail again, it reverts to the current version.

- `--quiet`: **(Optional)** Enables quiet mode:
  - Suppresses detailed console output and test logs.
  - Runs npm operations in background.
  - Only shows critical errors and final log file location.
  - Full detailed logs are still written to the log file.

- `--pass=N`: **(Optional)** Specifies the number of passes to attempt updating packages. Default is 1.

### 3. Examples

#### Example 1: Basic Update
Run the script to update packages in a project located at `/path/to/project`:
```bash
python updatePackages.py /path/to/project
```

#### Example 2: Safe Mode
Run the script in safe mode to ensure updates are validated with tests:
```bash
python updatePackages.py /path/to/project --safe
```

#### Example 3: Quiet Mode
Run the script in quiet mode for background execution:
```bash
python updatePackages.py /path/to/project --quiet
```

#### Example 4: Multiple Passes
Run the script with 3 passes to attempt updates multiple times:
```bash
python updatePackages.py /path/to/project --pass=3
```

#### Example 5: Combined Options
Combine safe mode, quiet mode, and multiple passes:
```bash
python updatePackages.py /path/to/project --safe --quiet --pass=3
```

### 4. Logging

- **Automatic Logging**: Every run creates a unique timestamped log file (e.g., `packupdate-2025-10-08T11-35-03-140.log`)
- **Error Tracking**: All errors are logged with detailed information
- **Success Tracking**: Successful package updates are recorded with version details
- **Failed Updates**: Packages that fail to update are tracked and logged
- **Review**: Log files can be reviewed later for troubleshooting or analysis

### 5. How It Works

1. **Dependency Update**:
   - The script identifies outdated packages using `npm outdated`.
   - It attempts to update each package to the latest version or the "wanted" version based on the mode.

2. **Audit Fix**:
   - After updating dependencies, the script runs `npm audit fix` to resolve any security vulnerabilities.

3. **Validation**:
   - The script runs your project's test suite (`npm test`) to ensure that the updates do not break functionality.

4. **Build**:
   - After updates, the script runs `npm run build` to ensure the project builds successfully.

5. **Logging**:
   - All operations are logged to a timestamped file for later review.

### 6. Logs and Output

- The script provides detailed logs during the update process, indicating:
  - Which packages were updated successfully.
  - Which packages were reverted to the "wanted" or current version due to issues.
  - Audit issues that were resolved.
- In quiet mode, detailed output is suppressed but full logs are maintained in the log file.

### 7. Rollback

If you encounter issues after running the script, you can manually revert to a previous state using your version control system (e.g., Git).

## Example Workflow

1. Ensure your project has a valid `package.json` and `package-lock.json`.
2. Run the script:
   ```bash
   python updatePackages.py /path/to/project --safe --quiet --pass=2
   ```
3. Review the generated log file to confirm updates and audit fixes.
4. Run your application to verify everything works as expected.

## Publishing to PyPI

To publish the `PackUpdate` package to PyPI, follow these steps:

1. **Install Required Tools**:
   Ensure you have `setuptools`, `wheel`, and `twine` installed:
   ```bash
   pip install setuptools wheel twine
   ```

2. **Build the Package**:
   Run the following command to create the distribution files:
   ```bash
   python setup.py sdist bdist_wheel
   ```

   This will generate the `dist/` directory containing the `.tar.gz` and `.whl` files.

3. **Upload to PyPI**:
   Use `twine` to upload the package to PyPI:
   ```bash
   twine upload dist/*
   ```

4. **Authenticate**:
   Enter your PyPI username and password when prompted.

5. **Verify the Upload**:
   Visit [https://pypi.org/project/PackUpdate/](https://pypi.org/project/PackUpdate/) to confirm the package is live.

### Notes:
- Ensure your `setup.py` file is correctly configured with metadata like `name`, `version`, `author`, etc.
- If you are testing the upload, use the Test PyPI repository:
  ```bash
  twine upload --repository-url https://test.pypi.org/legacy/ dist/*
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, feel free to open an issue in the repository.

