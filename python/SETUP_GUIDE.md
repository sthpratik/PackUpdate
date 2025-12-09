# Setup Guide - PackUpdate Python Package

## Prerequisites

### Required
- Python 3.8 or higher
- pip (Python package manager)
- npm (for testing npm package updates)

### Development Dependencies
The `package-and-publish.sh` script will automatically install these if missing:
- `wheel` - For building wheel distributions
- `twine` - For uploading to PyPI

## Installation

### For Development
```bash
cd python
pip install -e .
```

This installs the package in "editable" mode, so changes to the code are immediately reflected.

### For Testing
```bash
cd python
pip install -e .
python run_tests.py
```

### Install Development Dependencies Manually
```bash
cd python
pip install -r requirements-dev.txt
```

## Common Issues

### Issue: `error: invalid command 'bdist_wheel'`

**Cause**: The `wheel` package is not installed.

**Solution**: The script now auto-installs it, or install manually:
```bash
pip install wheel
```

### Issue: `twine: command not found`

**Cause**: The `twine` package is not installed.

**Solution**: The script now auto-installs it, or install manually:
```bash
pip install twine
```

### Issue: Import errors when running

**Cause**: Package not installed or installed incorrectly.

**Solution**: Reinstall in editable mode:
```bash
cd python
pip uninstall packupdate
pip install -e .
```

### Issue: Tests fail

**Cause**: Dependencies not installed or code issues.

**Solution**: Check dependencies and run tests:
```bash
pip install inquirer requests
python run_tests.py
```

## Verification

After installation, verify everything works:

```bash
# Check version
updatepkgs --version
python -m packUpdate.updatePackages --version

# Check type
updatepkgs --type

# Run tests
cd python
python run_tests.py

# Check help
updatepkgs --help
```

Expected output:
```
$ updatepkgs --version
1.1.2

$ updatepkgs --type
python

$ python run_tests.py
Ran 57 tests in 0.839s
OK
```

## Publishing Setup

### PyPI Credentials

You need a PyPI account and API token:

1. Create account at https://pypi.org/account/register/
2. Generate API token at https://pypi.org/manage/account/token/
3. Configure credentials:

**Option 1: Using .pypirc file**
```bash
cat > ~/.pypirc << EOF
[pypi]
username = __token__
password = pypi-YOUR-API-TOKEN-HERE
EOF

chmod 600 ~/.pypirc
```

**Option 2: Using keyring**
```bash
pip install keyring
keyring set https://upload.pypi.org/legacy/ __token__
# Enter your API token when prompted
```

### Test Publishing (TestPyPI)

Before publishing to PyPI, test with TestPyPI:

1. Create account at https://test.pypi.org/
2. Update `package-and-publish.sh` to use TestPyPI:
   ```bash
   twine upload --repository testpypi dist/*
   ```
3. Install from TestPyPI:
   ```bash
   pip install --index-url https://test.pypi.org/simple/ packupdate
   ```

## Development Workflow

### 1. Make Changes
```bash
cd python
# Edit files in packUpdate/
```

### 2. Run Tests
```bash
python run_tests.py
```

### 3. Test Locally
```bash
python -m packUpdate.updatePackages --help
# Or if installed globally
updatepkgs --help
```

### 4. Publish (when ready)
```bash
./package-and-publish.sh
```

This will:
- ✅ Check for required packages (wheel, twine)
- ✅ Run all 57 tests
- ✅ Run local integration test
- ✅ Update version (patch bump)
- ✅ Build package
- ✅ Upload to PyPI

## Troubleshooting

### Script fails at dependency check
```bash
# Manually install dependencies
pip install wheel twine setuptools
```

### Script fails at tests
```bash
# Run tests manually to see detailed errors
python run_tests.py -v
```

### Script fails at build
```bash
# Check setup.py for errors
python setup.py check

# Try building manually
python setup.py sdist bdist_wheel
```

### Script fails at upload
```bash
# Check PyPI credentials
cat ~/.pypirc

# Try uploading manually
twine upload dist/*
```

## Quick Reference

| Task | Command |
|------|---------|
| Install for development | `pip install -e .` |
| Run tests | `python run_tests.py` |
| Check version | `updatepkgs --version` |
| Build package | `python setup.py sdist bdist_wheel` |
| Publish package | `./package-and-publish.sh` |
| Uninstall | `pip uninstall packupdate` |

## Next Steps

After setup:
1. Read `TESTING_BOTH_VERSIONS.md` to test Node.js and Python versions
2. Read `RELEASE_CHECKLIST.md` before publishing
3. Read `TEST_SUMMARY.md` to understand test coverage
