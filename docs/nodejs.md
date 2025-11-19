# Node.js Package - updatenpmpackages

## Overview

`updatenpmpackages` is a comprehensive Node.js package that automates the process of updating outdated npm packages with intelligent dependency resolution, breaking change detection, and comprehensive safety mechanisms.

**Available Commands:**
- `updatenpmpackages` - Full command name
- `updatepkgs` - Short alias for convenience

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

### 🤖 Git Automation
- **Complete Workflow Automation**: Clone → Update → Commit → PR
- **Multi-Platform Support**: Bitbucket Server, GitHub, GitLab
- **Smart Branch Management**: Auto-detects develop/master branches
- **Pull Request Generation**: Detailed PRs with update logs and security reports
- **Ticket Integration**: Jira/ticket linking in commits and PRs
- **SSH Authentication**: Secure git operations with SSH keys

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

## SSH Key Setup for Automation

The automation features require SSH keys for git operations. Follow these steps to set up SSH authentication:

### 1. Generate SSH Key
```bash
# Generate a new SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your.email@company.com"

# Save to default location (~/.ssh/id_rsa) when prompted
# Set a passphrase for security (recommended)
```

### 2. Add to SSH Agent
```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key
ssh-add ~/.ssh/id_rsa

# For macOS, add to keychain
ssh-add --apple-use-keychain ~/.ssh/id_rsa
```

### 3. Add Public Key to Git Servers

**Copy your public key:**
```bash
cat ~/.ssh/id_rsa.pub
```

**Bitbucket Server:**
- Personal Settings → SSH keys → Add key
- Paste public key content

**GitHub:**
- Settings → SSH and GPG keys → New SSH key
- Paste public key content

**GitLab:**
- User Settings → SSH Keys → Add key
- Paste public key content

### 4. Test SSH Connection
```bash
# Test your connections
ssh -T git@your-bitbucket-server.com
ssh -T git@github.com
ssh -T git@gitlab.com
```

### 5. Configure Custom SSH Ports (if needed)
Edit `~/.ssh/config`:
```
Host your-bitbucket-server.com
    HostName your-bitbucket-server.com
    Port 7999
    User git
    IdentityFile ~/.ssh/id_rsa
```

For detailed SSH setup instructions, see the [Automation Documentation](https://sthpratik.github.io/PackUpdate/#/automation).

### Automation Examples

```bash
# Basic Bitbucket Server automation
updatepkgs --automate \
  --platform bitbucket-server \
  --endpoint https://your-bitbucket-server.com \
  --token your-access-token \
  --repository WORKSPACE/repository \
  --ticket-no JIRA-456

# GitHub automation with safe mode
updatepkgs --automate \
  --platform github \
  --repository myorg/myapp \
  --safe \
  --minor-only

# Combined with existing features
updatepkgs --automate \
  --platform bitbucket-server \
  --repository WORKSPACE/webapp \
  --pass=3 \
  --remove-unused \
  --reviewers john.doe,jane.smith
```

### Environment Variables

```bash
# Set defaults to avoid repeating parameters
export PACKUPDATE_BITBUCKET_TOKEN="your-token"
export PACKUPDATE_BITBUCKET_ENDPOINT="https://your-bitbucket-server.com"
export PACKUPDATE_REVIEWERS="john.doe,jane.smith"

# Then use simplified commands
updatepkgs --automate --platform bitbucket-server --repository WORKSPACE/repo
```

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
# or use the short alias
updatepkgs

# Update specific project
updatenpmpackages /path/to/project
updatepkgs /path/to/project

# Safe mode with testing
updatenpmpackages --safe
updatepkgs --safe

# Interactive mode for selective updates
updatenpmpackages --interactive
updatepkgs --interactive

# Quiet mode for automation
updatenpmpackages --quiet
updatepkgs --quiet
```

### Interactive Mode

```bash
# Interactive package selection
updatenpmpackages --interactive
updatepkgs --interactive

# Interactive with safe mode
updatenpmpackages --interactive --safe
updatepkgs --interactive --safe
```

**Interactive Features:**
- **Package Selection**: Choose specific packages to update from a list
- **Version Choice**: Select between minor or major version updates for each package
- **Batch Operations**: Update multiple packages with different version strategies
- **Update Preview**: See exactly what will be updated before confirming
- **Selective Control**: Skip packages you don't want to update

### Version-Specific Updates

```bash
# Update only minor versions (safer)
updatenpmpackages --minor-only
updatepkgs --minor-only

# Multiple update passes
updatenpmpackages --pass=3
updatepkgs --pass=3

# Combined safe minor updates
updatenpmpackages --safe --minor-only
updatepkgs --safe --minor-only
```

### Analysis & Reporting

```bash
# Generate comprehensive report (no updates)
updatenpmpackages --generate-report
updatepkgs --generate-report

# Report with specific project
updatenpmpackages /path/to/project --generate-report
updatepkgs /path/to/project --generate-report

# Quiet report generation
updatenpmpackages --generate-report --quiet
updatepkgs --generate-report --quiet
```

### Cleanup Operations

```bash
# Remove unused dependencies
updatenpmpackages --remove-unused
updatepkgs --remove-unused

# Deduplicate packages
updatenpmpackages --dedupe-packages
updatepkgs --dedupe-packages

# Combined cleanup
updatenpmpackages --remove-unused --dedupe-packages
updatepkgs --remove-unused --dedupe-packages
```

### Version Management

```bash
# Update packages and bump project version
updatenpmpackages --update-version=minor
updatepkgs --update-version=major

# Set specific project version after updates
updatenpmpackages --update-version=1.2.3
updatepkgs --update-version=2.0.0

# Combined with other options
updatenpmpackages --safe --update-version=patch
updatepkgs --interactive --update-version=minor
```

**Version Update Types:**
- **`major`** - Increment major version (1.0.0 → 2.0.0)
- **`minor`** - Increment minor version (1.0.0 → 1.1.0)  
- **`patch`** - Increment patch version (1.0.0 → 1.0.1)
- **`x.y.z`** - Set specific version (e.g., 1.2.3)

**Automatic Updates:**
- Updates both `package.json` and `package-lock.json`
- Only updates version if package updates were successful
- Maintains proper semver format

## Command Line Options

### Core Options
- `--safe` - Enable safe mode (test updates before applying)
- `--quiet` - Enable quiet mode (minimal console output)
- `--interactive` - Interactive mode for selective package updates
- `--pass=<number>` - Number of update passes (default: 1)

### Update Control
- `--minor-only` - Update only minor versions (1.2.x → 1.3.x, skip major updates)

### Analysis & Reporting
- `--generate-report` - Generate comprehensive security & dependency report (no updates)

### Cleanup & Maintenance
- `--remove-unused` - Clean up unused dependencies
- `--dedupe-packages` - Remove duplicate dependencies

### Version Management
- `--update-version=<type>` - Update project version after successful updates (major|minor|patch|x.y.z)

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

## 📚 Documentation
Full documentation is available at: [PackUpdate Docs](https://sthpratik.github.io/PackUpdate/#/)

Or serve locally:
```bash
git clone https://github.com/sthpratik/PackUpdate.git
cd PackUpdate/docs
python -m http.server 3000
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/sthpratik/PackUpdate/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments
- [npm](https://www.npmjs.com/) - Package management
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [depcheck](https://github.com/depcheck/depcheck) - Unused dependency detection

## 🐛 Issues & Support
- Report bugs: [GitHub Issues](https://github.com/sthpratik/PackUpdate/issues)
- Feature requests: [GitHub Discussions](https://github.com/sthpratik/PackUpdate/discussions)
- Documentation: [PackUpdate Docs](https://sthpratik.github.io/PackUpdate/#/)
