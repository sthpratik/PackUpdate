#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Cleaning up old builds..."
npm run clean

echo "Building the project..."
npm run build

echo "Publishing the package to npm..."
npm publish

echo "Package published successfully!"
