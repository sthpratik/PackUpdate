# updatenpmpackages

updatenpmpackages is a personal project designed to streamline and manage package updates efficiently. This is node package

## Features
- Easy package management.
- Automated update checks.
- User-friendly interface.
- Safe mode for testing updates before applying them.

## Installation
### As a Standalone Application
1. Clone the repository:
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
- `--pass=<number>`: Specifies the number of update passes to perform. Defaults to 1.
- `<projectPath>`: Optional. Specifies the path to the project. Defaults to the current working directory.

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

#### Multiple Passes
To perform multiple update passes:
```bash
updatenpmpackages --pass=3
```

#### Specify Project Path
To update a specific project:
```bash
updatenpmpackages /path/to/your/project
```

### Detailed Workflow
1. **Check for Outdated Packages**: The tool uses `npm outdated` to identify outdated packages.
2. **Resolve Update Order**: Dependencies are resolved to ensure updates occur in the correct order.
3. **Update Packages**: Packages are updated to the latest or wanted versions based on the mode.
4. **Run Tests**: If in safe mode, the tool runs `npm run build` and `npm test` after each update.
5. **Summary**: A final summary is displayed, showing updated packages and any failures.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
