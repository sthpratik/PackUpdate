#!/bin/bash

set -e  # Exit on any error

echo "=========================================="
echo "PackUpdate Python Package Build & Publish"
echo "=========================================="

echo ""
echo "Step 0: Checking dependencies..."
echo "---"

# Check for required packages
if ! python3 -c "import wheel" 2>/dev/null; then
    echo "❌ 'wheel' package not found. Installing..."
    pip install wheel
fi

if ! python3 -c "import twine" 2>/dev/null; then
    echo "❌ 'twine' package not found. Installing..."
    pip install twine
fi

echo "✅ All required packages available"

echo ""
echo "Step 1: Running test suite..."
echo "---"
python3 run_tests.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Tests failed! Aborting publish."
    exit 1
fi

echo ""
echo "✅ All tests passed!"
echo ""

echo "Step 2: Running local integration test..."
echo "---"
python3 test-local.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Local test failed! Aborting publish."
    exit 1
fi

echo ""
echo "✅ Local test passed!"
echo ""

echo "Step 3: Updating version..."
echo "---"
python3 -c "
import re
with open('setup.py', 'r') as f:
    content = f.read()
version_match = re.search(r'version=\"(\d+)\.(\d+)\.(\d+)\"', content)
if version_match:
    major, minor, patch = map(int, version_match.groups())
    new_version = f'{major}.{minor}.{patch + 1}'
    new_content = re.sub(r'version=\"\d+\.\d+\.\d+\"', f'version=\"{new_version}\"', content)
    with open('setup.py', 'w') as f:
        f.write(new_content)
    print(f'Version updated to {new_version}')
"

echo ""
echo "Step 4: Cleaning previous builds..."
echo "---"
rm -rf build/ dist/ *.egg-info/
echo "✅ Cleaned build directories"

echo ""
echo "Step 5: Building package..."
echo "---"
python3 setup.py sdist bdist_wheel

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Aborting publish."
    exit 1
fi

echo "✅ Package built successfully"

echo ""
echo "Step 6: Uploading to PyPI..."
echo "---"
twine upload dist/*

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Upload failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Package published successfully!"
echo "=========================================="
