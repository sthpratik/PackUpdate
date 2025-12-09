# PackUpdate Python Test Suite

Comprehensive test coverage for the PackUpdate Python package.

## Test Structure

```
tests/
├── __init__.py              # Test package initialization
├── test_imports.py          # Module import validation
├── test_cli.py              # CLI argument parsing tests
├── test_version.py          # Version comparison utilities
├── test_update_packages.py  # Core update functionality
├── test_integration.py      # Integration and edge case tests
└── README.md               # This file
```

## Running Tests

### Run All Tests
```bash
python run_tests.py
```

### Run Specific Test File
```bash
python -m unittest tests.test_imports
python -m unittest tests.test_cli
python -m unittest tests.test_version
python -m unittest tests.test_update_packages
python -m unittest tests.test_integration
```

### Run Specific Test Class
```bash
python -m unittest tests.test_cli.TestCLIParsing
python -m unittest tests.test_update_packages.TestResolveUpdateOrder
```

### Run Specific Test Method
```bash
python -m unittest tests.test_cli.TestCLIParsing.test_safe_mode_flag
```

## Test Coverage

### Module Imports (test_imports.py)
- ✅ Main module import validation
- ✅ Utils module imports (logger, cli, version)
- ✅ Services module imports (all 6 services)
- ✅ Lazy import validation in functions
- ✅ Entry point imports from __init__.py

**Total: 5 tests**

### CLI Parsing (test_cli.py)
- ✅ Default arguments
- ✅ Project path argument
- ✅ Boolean flags (--safe, --interactive, --minor-only, etc.)
- ✅ Value arguments (--pass, --update-version)
- ✅ Automation arguments (--platform, --repository, etc.)
- ✅ Combined flags
- ✅ Special characters in values

**Total: 17 tests**

### Version Utilities (test_version.py)
- ✅ Minor version update detection
- ✅ Patch version update detection
- ✅ Major version update detection
- ✅ Same version handling
- ✅ Prerelease version handling

**Total: 5 tests**

### Update Packages (test_update_packages.py)
- ✅ Project path validation (valid, invalid, file vs directory)
- ✅ Dependency resolution (no deps, linear, complex, circular)
- ✅ Script execution (exists, missing, fails, no package.json)
- ✅ Test running (build/test success/failure combinations)

**Total: 14 tests**

### Integration & Edge Cases (test_integration.py)
- ✅ Project validation + script execution integration
- ✅ Empty outdated packages handling
- ✅ CLI + validation integration
- ✅ Invalid package.json handling
- ✅ Missing dependency tree keys
- ✅ Single package update
- ✅ Many packages (50+) with no dependencies
- ✅ Versions with special characters
- ✅ CLI values with multiple equal signs

**Total: 10 tests**

## Test Statistics

- **Total Tests**: 51
- **Test Files**: 5
- **Test Classes**: 13
- **Coverage Areas**: Imports, CLI, Version Utils, Core Logic, Integration, Error Handling, Edge Cases

## Key Test Scenarios

### Import Error Prevention
The `test_imports.py` suite specifically tests for the import error that was fixed:
- Validates all relative imports work correctly
- Tests lazy imports within functions
- Ensures service modules can be imported

### Dependency Resolution
Tests cover various dependency graph scenarios:
- No dependencies (parallel updates)
- Linear chains (A → B → C)
- Complex graphs (multiple dependencies)
- Circular dependencies (graceful handling)

### CLI Argument Parsing
Comprehensive coverage of all CLI flags:
- Basic flags (--safe, --quiet, --interactive)
- Feature flags (--minor-only, --generate-report)
- Cleanup flags (--remove-unused, --dedupe-packages)
- Automation flags (--automate, --platform, --repository)
- Value arguments (--pass, --update-version, --token)

### Error Handling
Tests validate graceful error handling:
- Invalid project paths
- Missing or malformed package.json
- Failed build/test scripts
- Missing dependency tree data

### Edge Cases
Tests cover boundary conditions:
- Single package updates
- Large numbers of packages (50+)
- Versions with prerelease tags and build metadata
- CLI values containing special characters

## Adding New Tests

When adding new features, follow this pattern:

1. **Create test file** in `tests/` directory with `test_` prefix
2. **Import required modules** with proper path setup
3. **Create test class** inheriting from `unittest.TestCase`
4. **Add test methods** with `test_` prefix and descriptive names
5. **Use assertions** to validate behavior
6. **Run tests** to ensure they pass

Example:
```python
import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from packUpdate.your_module import your_function

class TestYourFeature(unittest.TestCase):
    """Test your new feature"""
    
    def test_basic_functionality(self):
        """Test basic use case"""
        result = your_function('input')
        self.assertEqual(result, 'expected')
    
    def test_edge_case(self):
        """Test edge case"""
        result = your_function('')
        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- Fast execution (< 1 second)
- No external dependencies required
- Clear pass/fail indicators
- Verbose output for debugging

## Test Maintenance

- Keep tests focused and independent
- Use descriptive test names
- Add docstrings explaining what's being tested
- Mock external dependencies (npm commands, file system when appropriate)
- Clean up test fixtures in tearDown methods
