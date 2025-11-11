# --minor-only Feature Implementation

## Overview
Successfully implemented the `--minor-only` flag for PackUpdate, allowing users to update only minor versions while skipping major version updates.

## Implementation Details

### Node.js Version (`/node/src/updatePackages.ts`)
- Added `isMinorUpdate()` function to check if an update is a minor version change
- Modified `getOutdatedPackages()` to accept `minorOnly` parameter and filter packages
- Updated `updatePackagesInPass()` to pass the `minorOnly` flag
- Enhanced CLI argument parsing in `main()` to handle `--minor-only` flag
- Updated help text to document the new feature

### Python Version (`/python/packUpdate/updatePackages.py`)
- Added `is_minor_update()` function with regex-based version parsing
- Modified `get_outdated_packages()` to support `minor_only` parameter
- Updated `run_update_process()` to accept and use `minor_only` parameter
- Enhanced CLI argument parsing in `main()` to handle `--minor-only` flag
- Updated help text to document the new feature

### MCP Server (`/mcp-server/index.js`)
- Added `minor_only` parameter to the `update_packages` tool schema
- Updated `updatePackages()` method to handle the new parameter
- Added `--minor-only` flag to command arguments when building the command

## Version Logic
The minor-only filter works by:
1. Parsing version strings to extract major.minor.patch components
2. Comparing current and latest versions
3. Only including packages where:
   - Major version remains the same
   - Minor or patch version differs

## Testing
- ✅ Both Node.js and Python versions build successfully
- ✅ Help text displays correctly with new `--minor-only` option
- ✅ Full test suite passes
- ✅ Manual testing confirms filtering works correctly
- ✅ MCP server integration updated

## Usage Examples

```bash
# Update only minor versions in current directory
updatenpmpackages --minor-only

# Combine with other flags
updatenpmpackages --minor-only --safe --quiet

# Specify project path
updatenpmpackages /path/to/project --minor-only

# Multiple passes with minor-only
updatenpmpackages --minor-only --pass=3
```

## Benefits
- **Safer updates**: Avoids potentially breaking major version changes
- **Gradual migration**: Allows incremental updates without major refactoring
- **Risk reduction**: Minimizes compatibility issues in production environments
- **Flexibility**: Can be combined with existing flags like `--safe` and `--quiet`

## Next Steps
This implementation provides a solid foundation for adding the remaining features from the FEATURE_SUGGESTIONS.md file. The next recommended features to implement would be:

1. `--patch-only` - Similar to minor-only but for patch versions only
2. `--exclude-major` - Inverse of minor-only, exclude major updates but allow minor/patch
3. `--security-only` - Update only packages with known vulnerabilities

The modular approach used here makes it easy to add these additional filtering options.
