#!/bin/bash

set -e  # Exit on any error

echo "=========================================="
echo "PackUpdate Node.js Package Build & Publish"
echo "=========================================="

echo ""
echo "Step 1: Cleaning previous build..."
echo "---"
npm run clean
echo "✅ Cleaned dist directory"

echo ""
echo "Step 2: Building TypeScript..."
echo "---"
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Aborting publish."
    exit 1
fi

echo "✅ TypeScript compiled successfully"

echo ""
echo "Step 3: Running local integration test..."
echo "---"
./test-local.sh

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Tests failed! Aborting publish."
    exit 1
fi

echo "✅ All tests passed!"

echo ""
echo "Step 4: Updating version..."
echo "---"
npm version patch

echo ""
echo "Step 5: Publishing to npm..."
echo "---"
npm publish

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Publish failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Package published successfully!"
echo "=========================================="
