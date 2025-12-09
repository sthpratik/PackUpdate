# Changelog - PackUpdate MCP Server

## [1.1.0] - 2024-12-09

### Added
- ✨ **Git Automation Tool** (`automate_updates_with_git`)
  - Full workflow from clone to PR creation
  - Support for Bitbucket Server, GitHub, and GitLab
  - Automatic branch creation and PR submission
  - Reviewer assignment
  - Ticket number integration

- ✨ **Interactive Mode Tool** (`update_packages_interactive`)
  - Visual package selection interface
  - Safe mode support
  - Auto-detection of project type

- ✨ **Version Management**
  - `update_version` parameter in `update_packages`
  - Support for major, minor, patch, and specific versions

- ✨ **Enhanced Options**
  - All CLI flags now available via MCP
  - `remove_unused` - Clean up unused dependencies
  - `dedupe_packages` - Remove duplicate dependencies
  - `passes` - Multiple update passes
  - `minor_only` - Skip major version updates
  - `generate_report` - Security report generation

### Changed
- 📝 Updated tool descriptions for clarity
- 📝 Enhanced parameter documentation
- 🔧 Improved error handling for Git operations
- 🔧 Better timeout handling for long-running operations

### Documentation
- 📚 Comprehensive README with all tools
- 📚 Usage examples for each tool
- 📚 Git automation workflow examples
- 📚 Troubleshooting guide

## [1.0.0] - 2024-11-19

### Initial Release
- 🎉 Basic package update functionality
- 🎉 Log analysis and retrieval
- 🎉 Auto-fix capabilities
- 🎉 Progress logging
- 🎉 Q CLI integration
