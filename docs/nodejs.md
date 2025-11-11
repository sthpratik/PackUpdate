# Node.js Package - updatenpmpackages

## Overview

`updatenpmpackages` is a comprehensive Node.js package that automates the process of updating outdated npm packages with intelligent dependency resolution, breaking change detection, and comprehensive safety mechanisms.

## Features

### 🚀 Core Update Features
- **Smart Update Algorithm**: Latest → Wanted → Revert strategy with automatic rollback
- **Safe Mode**: Test builds and tests after each update
- **Dependency Resolution**: Updates packages in correct dependency order
- **Multiple Passes**: Configurable number of update attempts

### 🔍 Intelligence & Analysis
- **Breaking Change Detection**: Automatic risk assessment for major version updates
- **Safe Package Prioritization**: Low-risk packages updated first
- **Security Analysis**: Vulnerability detection and reporting
- **Dependency Intelligence**: Circular dependency detection and analysis

### 🧹 Maintenance & Cleanup
- **Remove Unused Dependencies**: Intelligent unused package detection with depcheck
- **Deduplicate Packages**: Optimize node_modules with npm dedupe
- **Package Optimization**: Reduce bundle size and complexity

### 📊 Comprehensive Reporting
- **Security & Dependency Reports**: Detailed JSON and console reports
- **Breaking Change Analysis**: Risk assessment with actionable recommendations
- **Vulnerability Scanning**: CVE detection with severity levels
- **Update Statistics**: Success/failure tracking with detailed logs

### 📝 Advanced Logging
- **Dual Log System**: Summary and detailed logs
- **Complete Output Capture**: Full npm command output preservation
- **Quiet Mode**: Automation-friendly minimal output
- **Audit Trails**: Complete operation history

## Installation

### Global Installation
```bash
npm install -g updatenpmpackages
```

### Local Development
```bash
# Clone and build
git clone <repository>
cd node
npm install
npm run build

# Link for global use
npm link
```

## Usage

### Basic Commands

```bash
# Update packages in current directory
updatenpmpackages

# Update specific project
updatenpmpackages /path/to/project

# Safe mode with testing
updatenpmpackages --safe

# Quiet mode for automation
updatenpmpackages --quiet
```

### Version-Specific Updates

```bash
# Update only minor versions (safer)
updatenpmpackages --minor-only

# Multiple update passes
updatenpmpackages --pass=3

# Combined safe minor updates
updatenpmpackages --safe --minor-only
```

### Analysis & Reporting

```bash
# Generate comprehensive report (no updates)
updatenpmpackages --generate-report

# Report with specific project
updatenpmpackages /path/to/project --generate-report

# Quiet report generation
updatenpmpackages --generate-report --quiet
```

### Cleanup Operations

```bash
# Remove unused dependencies
updatenpmpackages --remove-unused

# Deduplicate packages
updatenpmpackages --dedupe-packages

# Combined cleanup
updatenpmpackages --remove-unused --dedupe-packages
```

## Command Line Options

### Core Options
- `--safe` - Enable safe mode (test updates before applying)
- `--quiet` - Enable quiet mode (minimal console output)
- `--pass=<number>` - Number of update passes (default: 1)

### Update Control
- `--minor-only` - Update only minor versions (1.2.x → 1.3.x, skip major updates)

### Analysis & Reporting
- `--generate-report` - Generate comprehensive security & dependency report (no updates)

### Cleanup & Maintenance
- `--remove-unused` - Clean up unused dependencies
- `--dedupe-packages` - Remove duplicate dependencies

### Information
- `--version` - Show package version
- `--type` - Show package type (nodejs)
- `--help` - Show help message

## Smart Update Algorithm

### Safe Mode Process
1. **Try Latest Version** → Install → Run Tests
2. **If Fails, Try Wanted Version** → Install → Run Tests
3. **If Fails, Revert to Current** → Install → Run Tests
4. **Only Mark as Updated** if newer version works

### Breaking Change Detection
- **Major Version Analysis**: Detects 1.x.x → 2.x.x changes
- **Risk Assessment**: Categorizes packages as safe or risky
- **Peer Dependency Check**: Validates compatibility
- **Safe-First Updates**: Prioritizes low-risk packages

This comprehensive Node.js package provides enterprise-grade dependency management with safety, intelligence, and automation capabilities.
