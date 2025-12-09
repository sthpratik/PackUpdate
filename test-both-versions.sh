#!/bin/bash

echo "=========================================="
echo "Testing Both Node.js and Python Versions"
echo "=========================================="

echo ""
echo "Step 1: Building Node.js version..."
cd node
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Node.js build successful"
else
    echo "❌ Node.js build failed"
    exit 1
fi
cd ..

echo ""
echo "Step 2: Testing Node.js version..."
echo "---"
echo "Version: $(node node/dist/updatePackages.js --version)"
echo "Type: $(node node/dist/updatePackages.js --type)"

echo ""
echo "Step 3: Testing Python version..."
echo "---"
echo "Version: $(python -m packUpdate.updatePackages --version)"
echo "Type: $(python -m packUpdate.updatePackages --type)"

echo ""
echo "Step 4: Checking currently active global command..."
echo "---"
echo "Command location: $(which updatepkgs)"
echo "Active type: $(updatepkgs --type)"
echo "Active version: $(updatepkgs --version)"

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Node.js: Direct run with 'node node/dist/updatePackages.js'"
echo "Python: Direct run with 'python -m packUpdate.updatePackages'"
echo "Global: Currently using $(updatepkgs --type) version"
echo ""
