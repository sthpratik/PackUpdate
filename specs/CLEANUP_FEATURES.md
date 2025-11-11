# Package Cleanup Features

## Overview
PackUpdate now includes intelligent package cleanup capabilities to remove unused dependencies and deduplicate packages, helping maintain clean and optimized project dependencies.

## Features Implemented

### 🗑️ Remove Unused Dependencies (`--remove-unused`)
- **Intelligent Detection**: Uses `depcheck` when available for accurate unused package detection
- **Fallback Analysis**: Basic heuristic analysis when depcheck is not available
- **Safe Removal**: Only removes packages that are confirmed unused
- **Detailed Reporting**: Shows which packages were removed and why

### 📦 Deduplicate Packages (`--dedupe-packages`)
- **NPM Dedupe**: Leverages npm's built-in deduplication functionality
- **Dependency Optimization**: Removes duplicate versions of the same package
- **Size Reduction**: Reduces node_modules size and installation time
- **Statistics**: Reports number of unique packages remaining

## Usage Examples

### Remove Unused Dependencies
```bash
# Remove unused dependencies from current directory
updatenpmpackages --remove-unused

# Remove unused dependencies from specific project
updatenpmpackages /path/to/project --remove-unused

# Remove unused with quiet mode
updatenpmpackages --remove-unused --quiet
```

### Deduplicate Packages
```bash
# Deduplicate packages in current directory
updatenpmpackages --dedupe-packages

# Deduplicate packages in specific project
updatenpmpackages /path/to/project --dedupe-packages

# Combine with other operations
updatenpmpackages --dedupe-packages --quiet
```

### Combined Operations
```bash
# Remove unused and deduplicate in one command
updatenpmpackages --remove-unused --dedupe-packages

# Full cleanup with reporting
updatenpmpackages --generate-report
updatenpmpackages --remove-unused --dedupe-packages
```

## Implementation Details

### Node.js Implementation
```typescript
// Remove unused packages
export const removeUnusedPackages = (projectPath: string, quietMode: boolean): string[] => {
  // Uses depcheck for accurate detection
  // Falls back to basic analysis if depcheck unavailable
  // Returns array of removed package names
};

// Deduplicate packages
export const dedupePackages = (projectPath: string, quietMode: boolean): number => {
  // Runs npm dedupe command
  // Returns count of unique packages remaining
};
```

### Python Implementation
```python
# Remove unused packages
def remove_unused_packages(project_path, quiet_mode):
    # Uses depcheck via subprocess
    # Falls back to basic file analysis
    # Returns list of removed packages

# Deduplicate packages  
def dedupe_packages(project_path, quiet_mode):
    # Runs npm dedupe command
    # Returns count of unique packages
```

## Detection Methods

### Unused Package Detection

#### Primary Method: Depcheck
- **Accurate Analysis**: Uses AST parsing to detect actual usage
- **Import Detection**: Finds require/import statements
- **Dynamic Analysis**: Detects runtime usage patterns
- **Framework Aware**: Understands framework-specific patterns

#### Fallback Method: Basic Analysis
- **File Scanning**: Searches common files for package references
- **Conservative Approach**: Only suggests potentially unused packages
- **Manual Review**: Recommends manual verification before removal
- **Safe Default**: Does not auto-remove with basic analysis

### Deduplication Process
- **NPM Native**: Uses npm's built-in dedupe algorithm
- **Version Optimization**: Consolidates compatible versions
- **Dependency Tree**: Maintains proper dependency relationships
- **Lock File Update**: Updates package-lock.json appropriately

## Console Output Examples

### Remove Unused Output
```
=== Removing Unused Dependencies ===
📦 Found 2 unused dependencies:
  - unused-package-1
  - unused-package-2
🗑️  Removing unused-package-1...
🗑️  Removing unused-package-2...
✅ Removed 2 unused dependencies.

✅ Cleanup Summary: Removed 2 unused packages
```

### Dedupe Output
```
=== Deduplicating Dependencies ===
🔄 Running npm dedupe...
✅ Dependencies deduplicated successfully.
📦 15 unique packages remaining.

✅ Dedupe Summary: 15 unique packages remaining
```

### Fallback Analysis Output
```
=== Removing Unused Dependencies ===
⚠️  Depcheck not available, using basic analysis...
⚠️  Potentially unused packages (manual review recommended):
  - potentially-unused-1
  - potentially-unused-2
```

## Benefits

### 🚀 Performance Improvements
- **Faster Installs**: Fewer packages to download and install
- **Reduced Bundle Size**: Smaller node_modules directory
- **Quicker Builds**: Less code to process during builds
- **Lower Memory Usage**: Reduced memory footprint

### 🧹 Maintenance Benefits
- **Cleaner Dependencies**: Only necessary packages remain
- **Security Reduction**: Fewer packages means fewer potential vulnerabilities
- **Easier Auditing**: Simpler dependency tree to review
- **Version Conflicts**: Reduced chance of version conflicts

### 💰 Cost Savings
- **Storage**: Reduced disk space usage
- **Bandwidth**: Faster deployments with smaller packages
- **CI/CD**: Faster pipeline execution
- **Hosting**: Reduced deployment sizes

## Safety Features

### Conservative Approach
- **Verification**: Multiple checks before removing packages
- **Logging**: Detailed logs of all cleanup operations
- **Rollback Info**: Clear record of what was removed
- **Error Handling**: Graceful failure with detailed error messages

### Fallback Protection
- **Depcheck Unavailable**: Falls back to basic analysis
- **Analysis Uncertainty**: Recommends manual review
- **No Auto-Remove**: Conservative approach with basic analysis
- **User Control**: Clear indication of what will be removed

## Integration with Other Features

### Combined Workflows
```bash
# Complete project optimization workflow
updatenpmpackages --generate-report        # Analyze current state
updatenpmpackages --remove-unused          # Remove unused packages
updatenpmpackages --dedupe-packages        # Deduplicate remaining packages
updatenpmpackages --minor-only             # Update to latest safe versions
```

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Optimize dependencies
  run: |
    updatenpmpackages --remove-unused --quiet
    updatenpmpackages --dedupe-packages --quiet
    
- name: Update safe packages
  run: updatenpmpackages --minor-only --quiet
```

## Error Handling

### Common Scenarios
- **Depcheck Not Available**: Falls back to basic analysis
- **Permission Issues**: Clear error messages with solutions
- **Network Problems**: Graceful handling of npm command failures
- **Corrupted Lock Files**: Automatic cleanup and regeneration

### Recovery Options
- **Backup Recommendations**: Suggests creating backups before cleanup
- **Rollback Instructions**: Clear steps to restore previous state
- **Manual Verification**: Guidance for manual package review
- **Support Information**: Links to troubleshooting resources

## Future Enhancements

### Planned Features
- **Custom Rules**: User-defined rules for unused package detection
- **Whitelist Support**: Packages to never remove (e.g., dev tools)
- **Batch Operations**: Process multiple projects simultaneously
- **Integration Testing**: Automated testing after cleanup operations

### Advanced Analysis
- **Usage Patterns**: Detect packages used only in specific environments
- **Tree Shaking**: Integration with bundler tree-shaking analysis
- **Runtime Detection**: Detect packages used only at runtime
- **Framework Integration**: Better support for framework-specific patterns

## Conclusion

The cleanup features transform PackUpdate into a comprehensive dependency management tool that not only updates packages but also maintains optimal project hygiene. By removing unused dependencies and deduplicating packages, developers can maintain leaner, faster, and more secure projects.
