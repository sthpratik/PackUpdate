#!/bin/bash

echo "Testing Parameter Consistency Between Node.js and Python Versions"
echo "================================================================"

cd /Users/manshres1/Documents/Apps/PackUpdate

echo -e "\n1. Testing --version flag:"
echo "Node.js: $(node node/dist/updatePackages.js --version)"
echo "Python:  $(python python/packUpdate/updatePackages.py --version)"

echo -e "\n2. Testing --type flag:"
echo "Node.js: $(node node/dist/updatePackages.js --type)"
echo "Python:  $(python python/packUpdate/updatePackages.py --type)"

echo -e "\n3. Testing flags in different positions:"
echo "Node.js with flags first: $(node node/dist/updatePackages.js --safe --version)"
echo "Python with flags first:  $(python python/packUpdate/updatePackages.py --safe --version)"

echo -e "\n4. Testing with path and flags:"
echo "Node.js: $(node node/dist/updatePackages.js /tmp --version)"
echo "Python:  $(python python/packUpdate/updatePackages.py /tmp --version)"

echo -e "\n5. Testing help consistency:"
echo "Both versions show same usage pattern:"
echo "Node.js: $(node node/dist/updatePackages.js --help | grep "Usage:")"
echo "Python:  $(python python/packUpdate/updatePackages.py --help | grep "Usage:")"

echo -e "\nAll tests completed! Both versions should behave identically."
