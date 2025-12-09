# Quick Start Guide - PackUpdate

## Installation

### Python Package
```bash
pip install packupdate
```

### Node.js Package
```bash
npm install -g updatenpmpackages
```

## Basic Usage

```bash
# Update packages in current directory
updatepkgs

# Update with safe mode (tests after each update)
updatepkgs --safe

# Update specific project
updatepkgs /path/to/project --safe

# Update only minor versions (skip major updates)
updatepkgs --minor-only

# Interactive mode (select packages to update)
updatepkgs --interactive

# Generate security report (no updates)
updatepkgs --generate-report
```

## Development Setup

### Python Development
```bash
cd python
pip install -e .
python run_tests.py
```

### Node.js Development
```bash
cd node
npm install
npm run build
node dist/updatePackages.js --help
```

## Testing Both Versions

```bash
# Automated test
./test-both-versions.sh

# Manual test
node node/dist/updatePackages.js --version  # Node.js
python -m packUpdate.updatePackages --version  # Python
```

## Publishing

### Python
```bash
cd python
./package-and-publish.sh
```

### Node.js
```bash
cd node
./package-and-publish.sh
```

## Common Issues

### "Command not found"
```bash
# Check installation
which updatepkgs
pip show packupdate  # Python
npm list -g updatenpmpackages  # Node.js
```

### "Wrong version running"
```bash
# Check which version
updatepkgs --type

# Run specific version
node node/dist/updatePackages.js  # Node.js
python -m packUpdate.updatePackages  # Python
```

### "Build error: bdist_wheel"
```bash
# Install wheel package
pip install wheel twine
```

## Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **TESTING_BOTH_VERSIONS.md** - How to test both versions
- **PUBLISHING_GUIDE.md** - Publishing process
- **QUICK_TEST_REFERENCE.md** - Quick reference
- **COMPLETE_IMPLEMENTATION_SUMMARY.md** - Full summary

## Support

For detailed help, see the documentation files above or run:
```bash
updatepkgs --help
```
