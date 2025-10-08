# Local Development & Testing

This guide shows how to install and test PackUpdate locally without publishing to npm or PyPI.

## Quick Reference

### Node.js Local Install
```bash
cd PackUpdate/node
npm run build && npm link
updatenpmpackages --version  # Test
npm unlink -g updatenpmpackages  # Cleanup
```

### Python Local Install
```bash
cd PackUpdate/python
pip install -e .
updatenpmpackages --version  # Test
pip uninstall packupdate  # Cleanup
```

### MCP Server Local Test
```bash
cd PackUpdate/mcp-server
npm install && node test-mcp.js
```

## Node.js Package Local Installation

### Method 1: Global Link (Recommended for Development)

```bash
# Navigate to the Node.js package directory
cd PackUpdate/node

# Build the TypeScript code
npm run build

# Create a global symlink
npm link

# Now you can use 'updatenpmpackages' globally
updatenpmpackages --version
```

**Benefits:**
- Changes are immediately available after rebuilding
- No need to reinstall after code changes
- Easy to unlink when done: `npm unlink -g updatenpmpackages`

### Method 2: Local Install from Directory

```bash
# Install directly from local directory
npm install -g /path/to/PackUpdate/node

# Or install to a specific project
cd /your/test/project
npm install /path/to/PackUpdate/node
```

### Method 3: Pack and Install

```bash
# Navigate to Node.js package directory
cd PackUpdate/node

# Build the code
npm run build

# Create a tarball
npm pack

# Install the generated tarball
npm install -g updatenpmpackages-0.1.6.tgz
```

## Python Package Local Installation

### Method 1: Development Mode (Recommended)

```bash
# Navigate to the Python package directory
cd PackUpdate/python

# Install in development mode (editable install)
pip install -e .

# Now you can use the command globally
updatenpmpackages --version
```

**Benefits:**
- Changes are immediately available without reinstalling
- Easy to uninstall: `pip uninstall packupdate`
- Perfect for development and testing

### Method 2: Local Install from Directory

```bash
# Install directly from local directory
pip install /path/to/PackUpdate/python

# Or with full path
pip install file:///full/path/to/PackUpdate/python
```

### Method 3: Build and Install Wheel

```bash
# Navigate to Python package directory
cd PackUpdate/python

# Build the wheel
python setup.py bdist_wheel

# Install the wheel
pip install dist/packupdate-*.whl
```

## Testing Your Local Installation

### Basic Functionality Test

```bash
# Test version and type
updatenpmpackages --version
updatenpmpackages --type
updatenpmpackages --help

# Test with a sample project
mkdir test-project
cd test-project
echo '{"name":"test","version":"1.0.0","dependencies":{"lodash":"4.17.20"}}' > package.json
npm install

# Run PackUpdate
updatenpmpackages --quiet

# Check logs were created
ls logs/
```

### Using the Test Scripts

Both packages include test scripts:

```bash
# Test Node.js version
cd PackUpdate/node
./test-local.sh

# Test Python version  
cd PackUpdate/python
python test-local.py

# Test both versions
cd PackUpdate
./test-both.sh
```

## MCP Server Local Testing

### Setup for Local Development

```bash
# Navigate to MCP server directory
cd PackUpdate/mcp-server

# Install dependencies
npm install

# Test the server
node test-mcp.js
```

### Configure Q CLI for Local Testing

Update your Q CLI configuration to point to your local development path:

```json
{
  "mcpServers": {
    "packupdate-dev": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "/your/local/path/to/PackUpdate/mcp-server"
    }
  }
}
```

## Development Workflow

### For Node.js Development

```bash
# 1. Make code changes in src/updatePackages.ts
# 2. Build the changes
npm run build

# 3. Test immediately (if using npm link)
updatenpmpackages --version

# 4. Run comprehensive tests
./test-local.sh
```

### For Python Development

```bash
# 1. Make code changes in packUpdate/updatePackages.py
# 2. Test immediately (if using pip install -e .)
updatenpmpackages --version

# 3. Run comprehensive tests
python test-local.py
```

### For MCP Server Development

```bash
# 1. Make changes to index.js
# 2. Test the server
node test-mcp.js

# 3. Test with Q CLI (if configured)
# Ask Q CLI: "What versions of PackUpdate are installed?"
```

## Cleanup After Testing

### Remove Node.js Local Installation

```bash
# If you used npm link
npm unlink -g updatenpmpackages

# If you used npm install -g
npm uninstall -g updatenpmpackages

# If you used a specific tarball
npm uninstall -g updatenpmpackages
```

### Remove Python Local Installation

```bash
# Remove the package
pip uninstall packupdate

# Verify removal
pip show packupdate  # Should show "Package not found"
```

## Troubleshooting Local Development

### Common Issues

**"Command not found" after installation:**
```bash
# Check if the package is installed
npm list -g updatenpmpackages  # For Node.js
pip show packupdate            # For Python

# Check your PATH includes npm/pip global directories
echo $PATH
```

**Changes not reflected:**
```bash
# For Node.js: Rebuild after changes
cd PackUpdate/node
npm run build

# For Python: Reinstall if not using -e flag
pip uninstall packupdate
pip install -e /path/to/PackUpdate/python
```

**Permission errors:**
```bash
# Use sudo if needed (not recommended)
sudo npm install -g /path/to/package

# Or fix npm permissions (recommended)
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Verification Commands

```bash
# Verify installation location
which updatenpmpackages

# Check version matches your development version
updatenpmpackages --version

# Test basic functionality
updatenpmpackages --help
```

## Best Practices

1. **Use Development Mode**: Always use `npm link` or `pip install -e .` for active development
2. **Test Frequently**: Run test scripts after each change
3. **Clean Installs**: Uninstall and reinstall if you encounter issues
4. **Version Control**: Commit changes before testing to track what you're testing
5. **Separate Environments**: Use different terminal sessions for development and testing

This workflow allows you to test all your changes locally before publishing to npm or PyPI.
