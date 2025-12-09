# PackUpdate Architecture

## Overview

PackUpdate features a **modular, KISS-compliant architecture** with comprehensive safety mechanisms, AI integration capabilities, intelligent package management features, and complete Git automation workflows.

## Core Principles

### KISS Architecture
- **Single Responsibility**: Each module has one clear purpose
- **Modular Design**: Large functions broken into focused, testable modules
- **Clear Dependencies**: Import structure shows module relationships
- **Easy Debugging**: Issues can be isolated to specific modules

### Safety-First Approach
- **Smart Update Algorithm**: Latest → Wanted → Revert strategy
- **Breaking Change Detection**: Automatic risk assessment
- **Safe Package Prioritization**: Low-risk updates first
- **Comprehensive Testing**: Build and test validation after each update

### Automation-Ready Design
- **Git Workflow Integration**: Complete automation from clone to PR
- **Multi-Platform Support**: Bitbucket Server, GitHub, GitLab compatibility
- **SSH Authentication**: Secure git operations with auto-configuration
- **Workspace Isolation**: Unique temporary environments for parallel execution

## Node.js Architecture

### Directory Structure
```
src/
├── types.ts                    # Centralized type definitions
├── updatePackages.ts          # Main entry point with automation integration
├── utils/                     # Utility modules
│   ├── logger.ts             # Dual logging system (summary + detailed)
│   ├── version.ts            # Version comparison utilities
│   └── cli.ts               # Extended CLI parsing with automation flags
└── services/                 # Business logic modules
    ├── packageService.ts     # NPM operations & package management
    ├── dependencyService.ts  # Dependency analysis & resolution
    ├── testService.ts       # Test & build execution
    ├── reportService.ts     # Security & dependency reporting
    ├── updateService.ts     # Update orchestration & smart algorithms
    ├── cleanupService.ts    # Package cleanup & optimization
    ├── automationService.ts # Git automation & workflow management
    ├── interactiveService.ts # Interactive package selection
    └── versionService.ts    # Project version management
```

### Core Components

#### 🎯 Main Entry Point (`updatePackages.ts`)
- **Responsibility**: Application orchestration, flow control, and automation workflow
- **Size**: ~300 lines (expanded with automation integration)
- **Functions**: CLI parsing, path validation, operation routing, automation workflow execution

#### 🔧 Utilities (`utils/`)

**Logger (`logger.ts`)**
- **Dual Logging System**: Summary and detailed logs
- **Summary Log**: High-level events and results
- **Detailed Log**: Full command output, STDOUT/STDERR, debug info
- **Quiet Mode**: Respects console output preferences

**Version (`version.ts`)**
- **Semantic Version Analysis**: Major, minor, patch detection
- **Breaking Change Assessment**: Risk evaluation algorithms
- **Update Compatibility**: Version comparison utilities

**CLI (`cli.ts`)**
- **Argument Parsing**: Extended flag detection and validation with automation support
- **Help System**: Comprehensive usage documentation with automation examples
- **Environment Variables**: Support for default configuration via environment variables
- **Platform Validation**: Bitbucket Server, GitHub, GitLab parameter validation
- **Special Flags**: Version, type, help handling

#### 🏗️ Services (`services/`)

**Package Service (`packageService.ts`)**
- **NPM Operations**: Install, outdated detection, dependency trees
- **Output Capture**: Full npm command logging
- **Error Handling**: Graceful failure management
- **Version Filtering**: Minor-only, security-only options

**Update Service (`updateService.ts`)**
- **Smart Algorithm**: Latest → Wanted → Revert strategy
- **Safe Prioritization**: Risk-based update ordering
- **Progress Tracking**: Detailed update status reporting
- **Rollback Capability**: Automatic reversion on failure

**Report Service (`reportService.ts`)**
- **Security Analysis**: Vulnerability detection and assessment
- **Breaking Change Detection**: Major version and peer dependency analysis
- **Dependency Intelligence**: Circular dependency detection
- **Comprehensive Reporting**: JSON and console output formats

**Test Service (`testService.ts`)**
- **Script Execution**: npm run build/test with output capture
- **Failure Detection**: Exit code monitoring
- **Output Logging**: Full build/test output preservation
- **Conditional Execution**: Script existence validation

**Automation Service (`automationService.ts`)**
- **Git Operations**: SSH-based clone, branch creation, commit, push
- **Multi-Platform Support**: Bitbucket Server, GitHub, GitLab integration
- **SSH Configuration**: Auto-detection of SSH ports and hostnames
- **Pull Request Creation**: API-based PR generation with detailed descriptions
- **Workspace Management**: Unique temporary directories with cleanup
- **Error Handling**: Comprehensive validation and recovery

**Interactive Service (`interactiveService.ts`)**
- **Package Selection**: Checkbox-based interactive package selection
- **Version Control**: Individual package version strategy selection
- **Batch Operations**: Multiple package updates with different strategies
- **User Experience**: Intuitive CLI interface with clear options

**Version Service (`versionService.ts`)**
- **Project Version Management**: Automatic version bumping after updates
- **Semver Compliance**: Proper semantic versioning format maintenance
- **Flexible Updates**: Support for major, minor, patch, or specific versions
- **Dual File Updates**: Updates both package.json and package-lock.json

**Cleanup Service (`cleanupService.ts`)**
- **Unused Package Detection**: Depcheck integration with fallback
- **Deduplication**: npm dedupe with statistics
- **Safe Removal**: Conservative unused package elimination
- **Optimization**: node_modules size reduction

**Dependency Service (`dependencyService.ts`)**
- **Update Ordering**: Dependency-aware update sequencing
- **Circular Detection**: Dependency loop identification
- **Resolution Logic**: Conflict resolution algorithms

## Python Architecture

### Directory Structure
```
packUpdate/
├── main.py                   # Entry point with proper imports
├── updatePackages.py        # Main application logic with automation
├── utils/                   # Utility modules
│   ├── logger.py           # Logging utilities with dual system
│   ├── version.py          # Version comparison functions
│   └── cli.py             # Extended CLI parsing with automation flags
└── services/               # Business logic modules
    ├── package_service.py  # NPM operations
    ├── report_service.py   # Report generation
    ├── automation_service.py # Git automation & workflow management
    ├── interactive_service.py # Interactive package selection
    ├── version_service.py  # Project version management
    └── cleanup_service.py  # Package cleanup & optimization
```
    └── cleanup_service.py  # Package cleanup operations
```

### Cross-Platform Consistency
- **Identical Functionality**: Same features across Node.js and Python
- **Consistent CLI**: Same flags and behavior
- **Unified Logging**: Same log format and structure
- **Equivalent Algorithms**: Same smart update logic

## Data Flow Architecture

### Update Process Flow
```mermaid
graph TD
    A[CLI Input] --> B[Parse Arguments]
    B --> C{Operation Type?}
    C -->|Update| D[Get Outdated Packages]
    C -->|Report| E[Generate Report]
    C -->|Cleanup| F[Cleanup Operations]
    C -->|Automate| G[Automation Workflow]
    
    D --> H[Breaking Change Analysis]
    H --> I[Prioritize Safe Packages]
    I --> J[Resolve Dependencies]
    J --> K[Smart Update Algorithm]
    
    K --> L{Safe Mode?}
    L -->|Yes| M[Try Latest → Wanted → Revert]
    L -->|No| N[Try Latest Only]
    
    M --> O[Run Tests After Each]
    N --> P[Install Package]
    O --> Q[Log Results]
    P --> Q
    Q --> R[Final Summary]
    
    G --> S[Setup Workspace]
    S --> T[Clone Repository]
    T --> U[Create Feature Branch]
    U --> V[Install Dependencies]
    V --> W[Generate Report]
    W --> X[Execute Updates]
    X --> Y[Commit & Push]
    Y --> Z[Create Pull Request]
    Z --> AA[Cleanup Workspace]
```

### Automation Architecture

```mermaid
graph TD
    A[Automation Request] --> B[Validate Configuration]
    B --> C[Create Unique Workspace]
    C --> D{Platform Type?}
    
    D -->|Bitbucket Server| E[Get SSH Info from API]
    D -->|GitHub/GitLab| F[Use Standard SSH]
    
    E --> G[Clone via SSH]
    F --> G
    G --> H[Detect Base Branch]
    H --> I[Create Feature Branch]
    I --> J[Install Dependencies]
    J --> K[Generate Pre-Update Report]
    K --> L[Execute Package Updates]
    L --> M[Check for Changes]
    
    M -->|No Changes| N[Log Success & Cleanup]
    M -->|Has Changes| O[Stage & Commit]
    
    O --> P[Push Feature Branch]
    P --> Q{Platform API?}
    
    Q -->|Bitbucket Server| R[Create PR via API]
    Q -->|GitHub/GitLab| S[Manual PR Instructions]
    
    R --> T[Add Reviewers]
    S --> U[Cleanup Workspace]
    T --> U
    N --> U
```

### Multi-Platform Support

**Bitbucket Server Integration:**
- SSH port auto-detection via API
- Bearer token authentication for API calls
- Automatic PR creation with detailed descriptions
- Reviewer assignment support

**GitHub/GitLab Integration:**
- Standard SSH authentication (port 22)
- Branch creation and pushing
- Manual PR creation (automated CLI tools planned)

### Logging Architecture
```mermaid
graph LR
    A[Operation] --> B[Summary Logger]
    A --> C[Detailed Logger]
    B --> D[packupdate-TIMESTAMP.log]
    C --> E[packupdate-detailed-TIMESTAMP.log]
    D --> F[High-level Events]
    E --> G[Full Command Output]
```

## Sequence Diagrams

### Standard Update Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant PackageService
    participant UpdateService
    participant TestService
    participant Logger
    
    User->>CLI: updatepkgs [options]
    CLI->>CLI: Parse Arguments
    CLI->>PackageService: getOutdatedPackages()
    PackageService->>PackageService: npm outdated --json
    PackageService-->>CLI: outdatedPackages[]
    
    CLI->>UpdateService: updatePackages(packages)
    
    loop For each package
        UpdateService->>PackageService: installPackage(pkg, 'latest')
        PackageService->>PackageService: npm install pkg@latest
        PackageService-->>UpdateService: success/failure
        
        alt Success
            UpdateService->>TestService: runTests()
            TestService->>TestService: npm run build && npm test
            TestService-->>UpdateService: testResult
            
            alt Tests Pass
                UpdateService->>Logger: logSuccess(pkg)
            else Tests Fail
                UpdateService->>PackageService: installPackage(pkg, 'wanted')
                PackageService-->>UpdateService: result
                UpdateService->>TestService: runTests()
                TestService-->>UpdateService: testResult
                
                alt Tests Pass
                    UpdateService->>Logger: logSuccess(pkg, 'wanted')
                else Tests Fail
                    UpdateService->>PackageService: revertPackage(pkg)
                    UpdateService->>Logger: logFailure(pkg)
                end
            end
        else Failure
            UpdateService->>Logger: logFailure(pkg)
        end
    end
    
    UpdateService-->>CLI: updateResults
    CLI->>Logger: generateSummary()
    Logger-->>User: Display Summary
```

### Automation Workflow Sequence

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant AutomationService
    participant GitAPI
    participant PackageService
    participant UpdateService
    participant ReportService
    
    User->>CLI: updatepkgs --automate [options]
    CLI->>CLI: Validate Automation Config
    CLI->>AutomationService: startAutomation(config)
    
    AutomationService->>AutomationService: createWorkspace()
    AutomationService->>GitAPI: getSSHInfo()
    GitAPI-->>AutomationService: sshHost, sshPort
    
    AutomationService->>AutomationService: cloneRepository(ssh)
    AutomationService->>AutomationService: detectBaseBranch()
    AutomationService->>AutomationService: createFeatureBranch()
    
    AutomationService->>PackageService: installDependencies()
    PackageService-->>AutomationService: installed
    
    AutomationService->>ReportService: generatePreReport()
    ReportService-->>AutomationService: securityReport
    
    AutomationService->>UpdateService: executeUpdates()
    
    loop For each package
        UpdateService->>PackageService: updatePackage()
        PackageService-->>UpdateService: result
    end
    
    UpdateService-->>AutomationService: updateResults
    
    AutomationService->>AutomationService: checkForChanges()
    
    alt Has Changes
        AutomationService->>AutomationService: stageChanges()
        AutomationService->>AutomationService: createCommit()
        AutomationService->>AutomationService: pushBranch()
        
        AutomationService->>GitAPI: createPullRequest()
        GitAPI-->>AutomationService: prUrl
        
        alt Has Reviewers
            AutomationService->>GitAPI: assignReviewers()
        end
        
        AutomationService->>CLI: Success + PR URL
    else No Changes
        AutomationService->>CLI: No updates needed
    end
    
    AutomationService->>AutomationService: cleanupWorkspace()
    CLI-->>User: Display Results
```

### Report Generation Sequence

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant ReportService
    participant PackageService
    participant DependencyService
    
    User->>CLI: updatepkgs --generate-report
    CLI->>ReportService: generateReport()
    
    ReportService->>PackageService: getOutdatedPackages()
    PackageService-->>ReportService: outdatedList
    
    ReportService->>PackageService: auditPackages()
    PackageService->>PackageService: npm audit --json
    PackageService-->>ReportService: vulnerabilities
    
    ReportService->>DependencyService: analyzeDependencies()
    DependencyService->>DependencyService: Check circular deps
    DependencyService->>DependencyService: Analyze peer deps
    DependencyService-->>ReportService: dependencyAnalysis
    
    loop For each outdated package
        ReportService->>ReportService: detectBreakingChanges()
        ReportService->>ReportService: assessUpdateRisk()
    end
    
    ReportService->>ReportService: categorizePackages()
    ReportService->>ReportService: generateRecommendations()
    
    ReportService->>ReportService: saveJSONReport()
    ReportService->>CLI: reportData
    CLI-->>User: Display Report + File Path
```

### Interactive Update Sequence

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant InteractiveService
    participant PackageService
    participant UpdateService
    
    User->>CLI: updatepkgs --interactive
    CLI->>PackageService: getOutdatedPackages()
    PackageService-->>CLI: packages[]
    
    CLI->>InteractiveService: selectPackages(packages)
    InteractiveService->>User: Display checkbox list
    User->>InteractiveService: Select packages
    InteractiveService-->>CLI: selectedPackages[]
    
    loop For each selected package
        CLI->>InteractiveService: selectUpdateStrategy(pkg)
        InteractiveService->>User: Choose: latest/wanted/specific
        User->>InteractiveService: Select strategy
        InteractiveService-->>CLI: strategy
    end
    
    CLI->>UpdateService: updatePackages(selected, strategies)
    UpdateService->>PackageService: Execute updates
    PackageService-->>UpdateService: results
    UpdateService-->>CLI: summary
    CLI-->>User: Display Results
```

### Cleanup Operations Sequence

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant CleanupService
    participant PackageService
    
    User->>CLI: updatepkgs --remove-unused --dedupe-packages
    CLI->>CleanupService: startCleanup()
    
    alt Remove Unused
        CleanupService->>CleanupService: runDepcheck()
        CleanupService->>CleanupService: analyzeUnused()
        
        loop For each unused package
            CleanupService->>PackageService: uninstallPackage(pkg)
            PackageService-->>CleanupService: result
        end
    end
    
    alt Dedupe Packages
        CleanupService->>PackageService: dedupePackages()
        PackageService->>PackageService: npm dedupe
        PackageService-->>CleanupService: stats
    end
    
    CleanupService->>CLI: cleanupResults
    CLI-->>User: Display Summary
```

## Logging Architecture
    A[Console Output] --> B[log()]
    B --> C[Console Display]
    B --> D[Detailed Log]
    
    E[High-Level Events] --> F[writeLog()]
    F --> G[Summary Log]
    
    H[Command Execution] --> I[logCommand()]
    I --> D
    
    J[Package Operations] --> K[logPackageOperation()]
    K --> D
    
    L[Test Results] --> M[logTestExecution()]
    M --> D
```

## Feature Architecture

### Breaking Change Detection
```typescript
interface BreakingChangeAnalysis {
  safeUpdates: string[];           // Low-risk packages
  riskyUpdates: string[];          // High-risk packages
  analysis: Record<string, {
    hasMajorVersionChange: boolean;
    riskLevel: 'low' | 'high';
    hasBreakingChanges: boolean;
    migrationRequired: boolean;
  }>;
  peerDependencyIssues: Record<string, any>;
}
```

### Smart Update Algorithm
1. **Risk Assessment**: Analyze each package for breaking changes
2. **Prioritization**: Safe packages updated first
3. **Fallback Strategy**: Latest → Wanted → Current version
4. **Validation**: Build and test after each update
5. **Rollback**: Automatic reversion on failure

### Comprehensive Reporting
```typescript
interface ComprehensiveReport {
  timestamp: string;
  project: string;
  security: {
    vulnerabilities: Record<string, any>;
    vulnerable_packages: string[];
  };
  dependencies: {
    total: number;
    circular: string[];
    outdated: number;
    outdated_list: Record<string, OutdatedPackage>;
  };
  breakingChanges: BreakingChangeAnalysis;
  recommendations: string[];
}
```

## Integration Architecture

### MCP Server Integration
- **AI-Powered Analysis**: Intelligent failure resolution
- **Real-time Progress**: Live update streaming
- **Context Awareness**: Project-specific recommendations
- **Automated Decision Making**: AI-assisted update strategies

### CI/CD Integration
- **Quiet Mode**: Automation-friendly output
- **Exit Codes**: Proper success/failure signaling
- **JSON Reports**: Machine-readable output
- **Log Preservation**: Complete audit trails

## Performance Optimizations

### Modular Loading
- **Lazy Imports**: Load modules only when needed
- **Tree Shaking**: Eliminate unused code
- **Caching**: Intelligent dependency caching
- **Parallel Processing**: Concurrent operations where safe

### Memory Management
- **Stream Processing**: Handle large outputs efficiently
- **Garbage Collection**: Proper resource cleanup
- **Buffer Management**: Optimal memory usage
- **Process Isolation**: Separate npm command execution

## Security Architecture

### Safe Execution
- **Sandboxed Commands**: Isolated npm operations
- **Input Validation**: CLI argument sanitization
- **Path Traversal Protection**: Secure file operations
- **Permission Checks**: Proper access validation

### Vulnerability Management
- **Security Scanning**: Automated vulnerability detection
- **Risk Assessment**: CVE severity analysis
- **Safe Updates**: Security-focused update prioritization
- **Audit Trails**: Complete security logging

## Extensibility

### Plugin Architecture
- **Service Modules**: Easy feature addition
- **Hook System**: Pre/post operation hooks
- **Configuration**: Flexible behavior customization
- **API Compatibility**: Stable interfaces for extensions

### Future Enhancements
- **Custom Rules**: User-defined update policies
- **Integration APIs**: Third-party tool integration
- **Advanced Analytics**: Machine learning insights
- **Distributed Updates**: Multi-project coordination

## Quality Assurance

### Testing Strategy
- **Unit Tests**: Individual module testing
- **Integration Tests**: Cross-module functionality
- **End-to-End Tests**: Complete workflow validation
- **Performance Tests**: Scalability verification

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code style enforcement
- **Documentation**: Comprehensive inline docs
- **Error Handling**: Graceful failure management

This architecture ensures PackUpdate remains maintainable, extensible, and reliable while providing comprehensive package management capabilities.
