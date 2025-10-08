#!/bin/bash

echo "Building TypeScript..."
npx tsc

echo "Running tests..."
./test-local.sh

echo "Updating version..."
npm version patch

echo "Publishing to npm..."
npm publish

echo "Package published successfully!"
