#!/bin/bash

echo "Building TypeScript..."
npx tsc

echo "Creating test project..."
mkdir -p test-project
cd test-project

# Create a simple package.json with outdated packages
cat > package.json << 'EOF'
{
  "name": "test-project",
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

echo "Testing PackUpdate..."
node dist/updatePackages.js test-project

echo "Test completed. Check logs folder for output."
rm -rf test-project
