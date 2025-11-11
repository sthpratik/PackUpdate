#!/bin/bash

echo "Testing --minor-only functionality..."

# Create test project with mixed major and minor updates
mkdir -p test-minor-only
cd test-minor-only

cat > package.json << 'EOF'
{
  "name": "test-minor-only",
  "version": "1.0.0",
  "scripts": {
    "test": "echo 'Tests passed'",
    "build": "echo 'Build completed'"
  },
  "dependencies": {
    "lodash": "4.17.20",
    "axios": "0.21.0"
  }
}
EOF

npm install
cd ..

echo "Testing Node.js version with --minor-only..."
node node/dist/updatePackages.js test-minor-only --minor-only --quiet

echo "Testing Python version with --minor-only..."
python3 python/packUpdate/updatePackages.py test-minor-only --minor-only --quiet

echo "Cleaning up..."
rm -rf test-minor-only

echo "Minor-only test completed!"
