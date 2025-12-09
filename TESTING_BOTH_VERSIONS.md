# Testing Both Node.js and Python Versions

## The Problem

Both packages install the same command names:
- `updatepkgs`
- `updatenpmpackages`
- `packUpdate` (Python only)

When both are installed globally, the Python version (in your PATH) takes precedence.

## Solution: Test Each Version Directly

### Method 1: Run Directly from Build Output (Recommended)

#### Test Node.js Version
```bash
# Build first
cd node
npm run build

# Run directly from dist
node dist/updatePackages.js --version
node dist/updatePackages.js --help
node dist/updatePackages.js --type

# Test with a project
node dist/updatePackages.js /path/to/project --safe
```

#### Test Python Version
```bash
# Install in editable mode
cd python
pip install -e .

# Run via Python module
python -m packUpdate.updatePackages --version
python -m packUpdate.updatePackages --help
python -m packUpdate.updatePackages --type

# Or use the installed command
updatepkgs --version
packUpdate --version
```

### Method 2: Use npx for Node.js (Local Package)

```bash
cd node

# Install locally (not globally)
npm install

# Run via npx
npx updatenpmpackages --version
npx updatenpmpackages --help
npx updatenpmpackages --type
```

### Method 3: Check Which Version is Running

```bash
# Check which command is being used
which updatepkgs
which updatenpmpackages

# Check if it's Python or Node
updatepkgs --type
# Output: "python" or "node"

# For Python version
python -c "import packUpdate; print(packUpdate.__file__)"

# For Node version
npm list -g updatenpmpackages
```

### Method 4: Temporary PATH Manipulation

#### Test Node.js Only
```bash
# Uninstall Python version temporarily
pip uninstall packupdate

# Install Node.js version globally
cd node
npm install -g .

# Test
updatepkgs --version
updatepkgs --type  # Should show "node"

# Reinstall Python version
cd ../python
pip install -e .
```

#### Test Python Only
```bash
# Uninstall Node.js version
npm uninstall -g updatenpmpackages

# Test Python version
updatepkgs --version
updatepkgs --type  # Should show "python"

# Reinstall Node.js version
cd node
npm install -g .
```

## Recommended Testing Workflow

### 1. Test Node.js Version Directly
```bash
cd node
npm run build
node dist/updatePackages.js --version
node dist/updatePackages.js --help
node dist/updatePackages.js --type
```

### 2. Test Python Version via Module
```bash
cd python
python -m packUpdate.updatePackages --version
python -m packUpdate.updatePackages --help
python -m packUpdate.updatePackages --type
```

### 3. Compare Outputs
```bash
# Node.js
echo "=== Node.js Version ==="
node node/dist/updatePackages.js --version
node node/dist/updatePackages.js --type

# Python
echo "=== Python Version ==="
python -m packUpdate.updatePackages --version
python -m packUpdate.updatePackages --type
```

## Testing Script

Create a test script to compare both versions:

```bash
#!/bin/bash
# test-both-versions.sh

echo "=========================================="
echo "Testing Both Versions"
echo "=========================================="

echo ""
echo "=== Node.js Version ==="
cd node
npm run build > /dev/null 2>&1
node dist/updatePackages.js --version
node dist/updatePackages.js --type
cd ..

echo ""
echo "=== Python Version ==="
cd python
python -m packUpdate.updatePackages --version
python -m packUpdate.updatePackages --type
cd ..

echo ""
echo "=== Currently Active Command ==="
which updatepkgs
updatepkgs --type
updatepkgs --version
```

## Identifying Which Version is Running

### Add --type Flag Output

Both versions should output their type:

**Node.js** (`node/src/utils/cli.ts`):
```typescript
if (args.includes('--type')) {
  console.log('node');
  process.exit(0);
}
```

**Python** (`python/packUpdate/utils/cli.py`):
```python
if '--type' in sys.argv:
    print('python')
    sys.exit(0)
```

### Check Version Output Format

**Node.js**: Reads from `package.json`
**Python**: Reads from `setup.py`

## Best Practice for Development

### Keep Them Separate

1. **Node.js**: Install locally in project
   ```bash
   cd node
   npm install
   # Use: node dist/updatePackages.js
   ```

2. **Python**: Install in editable mode
   ```bash
   cd python
   pip install -e .
   # Use: python -m packUpdate.updatePackages
   ```

3. **For global testing**: Only install one at a time

## Quick Reference

| Command | Node.js | Python |
|---------|---------|--------|
| Direct run | `node node/dist/updatePackages.js` | `python -m packUpdate.updatePackages` |
| Check type | `node node/dist/updatePackages.js --type` | `python -m packUpdate.updatePackages --type` |
| Version | `node node/dist/updatePackages.js --version` | `python -m packUpdate.updatePackages --version` |
| Help | `node node/dist/updatePackages.js --help` | `python -m packUpdate.updatePackages --help` |

## Automated Comparison Test

```bash
# Create comparison script
cat > compare-versions.sh << 'EOF'
#!/bin/bash

echo "Building Node.js version..."
cd node && npm run build && cd ..

echo ""
echo "Testing --help output similarity..."
echo "=== Node.js ==="
node node/dist/updatePackages.js --help | head -20

echo ""
echo "=== Python ==="
python -m packUpdate.updatePackages --help | head -20

echo ""
echo "Testing --version..."
echo "Node.js: $(node node/dist/updatePackages.js --version)"
echo "Python: $(python -m packUpdate.updatePackages --version)"

echo ""
echo "Testing --type..."
echo "Node.js: $(node node/dist/updatePackages.js --type)"
echo "Python: $(python -m packUpdate.updatePackages --type)"
EOF

chmod +x compare-versions.sh
./compare-versions.sh
```
