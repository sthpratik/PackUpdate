# Quick Commands Reference

## Testing

```bash
# Test Python package
cd python && python run_tests.py

# Test Node.js package
cd node && npm run build

# Test both versions
./test-both-versions.sh

# Test MCP server
cd mcp-server && node test-new-features.js
```

## Publishing

```bash
# Publish Python package
cd python && ./package-and-publish.sh

# Publish Node.js package
cd node && ./package-and-publish.sh

# Publish MCP server
cd mcp-server && npm publish
```

## Running Packages

```bash
# Python version
python -m packUpdate.updatePackages --version
python -m packUpdate.updatePackages --safe /path/to/project

# Node.js version
node node/dist/updatePackages.js --version
node node/dist/updatePackages.js --safe /path/to/project

# Check which version is active
updatepkgs --type
updatepkgs --version
```

## MCP Server

```bash
# Install
npm install -g packupdate-mcp-server

# Run
packupdate-mcp

# Set environment variables
export PACKUPDATE_GITHUB_TOKEN="ghp_xxxxx"
export PACKUPDATE_BITBUCKET_TOKEN="your-token"
export PACKUPDATE_BITBUCKET_ENDPOINT="https://bitbucket.company.com"
```

## Development

```bash
# Python development
cd python
pip install -e .
python run_tests.py

# Node.js development
cd node
npm install
npm run build
npm run dev

# MCP server development
cd mcp-server
npm install
node index.js
```

## Git Automation (MCP)

```json
{
  "tool": "automate_updates_with_git",
  "arguments": {
    "platform": "github",
    "repository": "myorg/myapp"
  }
}
```

## Interactive Mode (MCP)

```json
{
  "tool": "update_packages_interactive",
  "arguments": {
    "project_path": "/path/to/project"
  }
}
```
