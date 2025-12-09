---
inclusion: always
---

# Technology Stack

## Languages & Runtimes

- **Node.js**: TypeScript (ES2020 target, CommonJS modules)
- **Python**: Python 3.8+ with setuptools

## Build Systems

### Node.js Package (`/node`)
- **Compiler**: TypeScript 5.0+
- **Build**: `npm run build` (compiles `src/` → `dist/`)
- **Output**: CommonJS modules with type definitions
- **Config**: `tsconfig.json` with strict mode enabled

### Python Package (`/python`)
- **Build**: `python setup.py sdist bdist_wheel`
- **Package Manager**: setuptools with find_packages()
- **Entry Points**: Multiple CLI aliases (packUpdate, updatepkgs, updatenpmpackages)

### MCP Server (`/mcp-server`)
- **Runtime**: Node.js 18+
- **No build step**: Direct JavaScript execution
- **Entry**: `index.js` with MCP protocol implementation

## Key Dependencies

### Node.js
- `inquirer@^9.2.0` - Interactive CLI prompts
- `@types/node`, `@types/inquirer` - TypeScript definitions

### Python
- `inquirer>=2.10.0` - Interactive CLI prompts
- `requests>=2.25.0` - HTTP requests for API calls

## Common Commands

### Development
```bash
# Node.js package
cd node
npm install
npm run build          # Compile TypeScript
npm run dev           # Build and run with default options
npm run clean         # Remove dist/

# Python package
cd python
pip install -e .      # Install in editable mode
python test-local.py  # Test locally

# MCP Server
cd mcp-server
npm install
node index.js         # Run MCP server
```

### Testing
```bash
# Test both implementations
./test-both.sh

# Test automation features
./test-automation.sh

# Test minor-only updates
./test-minor-only.sh

# Test consistency between Node.js and Python
./test-consistency.sh
```

### Publishing
```bash
# Node.js package
cd node
./package-and-publish.sh  # Build and publish to npm

# Python package
cd python
./package-and-publish.sh  # Build and publish to PyPI

# MCP Server
cd mcp-server
npm publish
```

## Documentation

- **Framework**: Docsify (static site generator)
- **Location**: `/docs` directory
- **Hosting**: GitHub Pages at https://sthpratik.github.io/PackUpdate/
- **Files**: Markdown with sidebar navigation

## Code Style

### TypeScript
- Strict mode enabled
- ES2020 target
- Explicit return types preferred
- Comprehensive inline documentation

### Python
- PEP 8 compliant
- Type hints where applicable
- Docstrings for public functions

## Architecture Principles

- **KISS**: Keep It Simple, Stupid - modular, focused functions
- **Single Responsibility**: Each service module has one clear purpose
- **Cross-Platform Consistency**: Identical functionality across Node.js and Python
- **Modular Services**: Business logic separated into service modules
