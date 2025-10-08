#!/bin/bash

echo "Running local tests..."
python3 test-local.py

echo "Updating version..."
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

echo "Cleaning previous builds..."
rm -rf build/ dist/ *.egg-info/

echo "Building package..."
python3 setup.py sdist bdist_wheel

echo "Uploading to PyPI..."
twine upload dist/*

echo "Package published successfully!"
