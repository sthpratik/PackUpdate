# Publishing PackUpdate MCP Server

Instructions for publishing the MCP server as a standalone NPM package.

## Prerequisites

1. **NPM Account**: Create account at https://www.npmjs.com/
2. **NPM CLI**: Ensure you're logged in: `npm login`
3. **Package Name**: Verify `packupdate-mcp-server` is available: `npm view packupdate-mcp-server`

## Publishing Steps

### 1. Prepare Package

```bash
cd mcp-server

# Verify package.json is correct
cat package.json

# Test the package locally
npm pack
```

### 2. Publish to NPM

```bash
# Publish (first time)
npm publish

# Or publish with public access if scoped
npm publish --access public
```

### 3. Verify Publication

```bash
# Check if published successfully
npm view packupdate-mcp-server

# Test installation
npm install -g packupdate-mcp-server
packupdate-mcp --help
```

## Version Updates

```bash
# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0

# Publish new version
npm publish
```

## Alternative Distribution Methods

### GitHub Releases

Create releases with pre-built packages:

```bash
# Create release archive
cd mcp-server
tar -czf packupdate-mcp-server-v1.0.0.tar.gz index.js package.json README.md

# Upload to GitHub Releases
# Users can download and extract
```

### Docker Container

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.js README.md ./
EXPOSE 3000
CMD ["node", "index.js"]
```

### MCP Registry (Future)

The MCP ecosystem is developing centralized registries. Monitor:
- https://github.com/modelcontextprotocol
- MCP community discussions for official registry announcements

## User Installation Options

Once published, users can install via:

```bash
# Global installation
npm install -g packupdate-mcp-server

# Local installation
npm install packupdate-mcp-server

# Direct from GitHub (if not on NPM)
npm install -g https://github.com/sthpratik/PackUpdate.git#main:mcp-server

# From tarball
npm install -g packupdate-mcp-server-v1.0.0.tar.gz
```

## Configuration Examples

### NPM Global Installation
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "packupdate-mcp"
    }
  }
}
```

### NPM Local Installation
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "npx",
      "args": ["packupdate-mcp-server"]
    }
  }
}
```

### Direct GitHub Installation
```json
{
  "mcpServers": {
    "packupdate": {
      "command": "node",
      "args": ["node_modules/packupdate-mcp-server/index.js"]
    }
  }
}
```
