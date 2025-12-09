---
inclusion: always
---

# PackUpdate Product Overview

PackUpdate is a cross-platform package management tool that automates npm package updates with intelligent safety mechanisms and Git workflow automation.

## Core Value Proposition

Safely update npm packages across Node.js and Python projects with automated testing, rollback capabilities, and comprehensive reporting.

## Key Features

- **Smart Update Algorithm**: Latest → Wanted → Revert strategy with automatic testing
- **Breaking Change Detection**: Analyzes major version changes and peer dependencies
- **Git Automation**: Complete workflow from clone to PR creation (Bitbucket Server, GitHub, GitLab)
- **Safety Mechanisms**: Safe mode with build/test validation after each update
- **Maintenance Tools**: Remove unused dependencies, deduplicate packages
- **Comprehensive Reporting**: Security vulnerabilities, dependency analysis, breaking changes
- **MCP Server Integration**: AI-powered package management with automatic log analysis

## Available Packages

1. **Node.js Package**: `updatenpmpackages` (npm)
2. **Python Package**: `packupdate` (pip)
3. **MCP Server**: `packupdate-mcp-server` (npm) - AI assistant integration

## Target Users

- Developers maintaining Node.js projects
- DevOps teams automating dependency updates
- AI assistants managing package updates via MCP protocol
