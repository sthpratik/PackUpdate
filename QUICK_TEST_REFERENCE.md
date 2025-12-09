# Quick Test Reference - Node.js vs Python

## TL;DR - How to Test Each Version

### Test Node.js Version
```bash
cd node
npm run build
node dist/updatePackages.js --version
node dist/updatePackages.js --help
```

### Test Python Version
```bash
cd python
python -m packUpdate.updatePackages --version
python -m packUpdate.updatePackages --help
```

### Test Both at Once
```bash
./test-both-versions.sh
```

## Current Status

Run this to see which version is active:
```bash
updatepkgs --type
updatepkgs --version
which updatepkgs
```

## Why npx Doesn't Work

`npx updatepkgs` looks for a globally installed npm package, but:
1. If you have the Python version installed via pip, it shadows the npm version
2. npx doesn't work with locally built packages unless they're in node_modules

## Solutions

### Option 1: Run Directly (Best for Development)
```bash
# Node.js
node node/dist/updatePackages.js [options]

# Python  
python -m packUpdate.updatePackages [options]
```

### Option 2: Install Only One Globally
```bash
# Uninstall both
pip uninstall packupdate
npm uninstall -g updatenpmpackages

# Install the one you want to test
npm install -g ./node  # For Node.js
# OR
pip install -e ./python  # For Python
```

### Option 3: Use Aliases
```bash
# Add to ~/.zshrc or ~/.bashrc
alias updatepkgs-node='node ~/path/to/PackUpdate/node/dist/updatePackages.js'
alias updatepkgs-python='python -m packUpdate.updatePackages'

# Then use
updatepkgs-node --version
updatepkgs-python --version
```

## Quick Comparison

| Feature | Node.js | Python |
|---------|---------|--------|
| **Run directly** | `node node/dist/updatePackages.js` | `python -m packUpdate.updatePackages` |
| **Check type** | Shows `nodejs` | Shows `python` |
| **Version** | 0.2.1 | 1.1.2 |
| **Build required** | Yes (`npm run build`) | No |
| **Test suite** | Manual tests | 57 automated tests |

## Testing Workflow

1. **Build Node.js version**
   ```bash
   cd node && npm run build && cd ..
   ```

2. **Run comparison**
   ```bash
   ./test-both-versions.sh
   ```

3. **Test specific version**
   ```bash
   # Node.js
   node node/dist/updatePackages.js --safe /path/to/project
   
   # Python
   python -m packUpdate.updatePackages --safe /path/to/project
   ```

## Troubleshooting

### "Command not found" for global command
- Check: `which updatepkgs`
- Fix: Install one version globally

### Wrong version running
- Check: `updatepkgs --type`
- Fix: Uninstall the other version or use direct run

### npx not working
- Don't use npx for local development
- Use direct run: `node node/dist/updatePackages.js`

## Pro Tip

Create a test project and run both versions on it:
```bash
mkdir test-project
cd test-project
npm init -y
npm install express@4.0.0

# Test Node.js version
node ../node/dist/updatePackages.js --safe

# Test Python version  
python -m packUpdate.updatePackages --safe
```
