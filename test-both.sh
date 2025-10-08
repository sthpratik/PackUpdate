#!/bin/bash

echo "Testing Node.js version..."
cd node
./test-local.sh
cd ..

echo "Testing Python version..."
cd python
python3 test-local.py
cd ..

echo "Both versions tested successfully!"
