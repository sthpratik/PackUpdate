# PackUpdate Architecture

This document provides architectural diagrams showing how PackUpdate works internally and how it integrates with AI assistants through the MCP server.

## System Architecture Overview

```mermaid
graph TB
    subgraph "PackUpdate Ecosystem"
        A[User/AI Assistant] --> B{Package Manager Choice}
        B -->|Global Install| C[Node.js Package<br/>updatenpmpackages]
        B -->|Pip Install| D[Python Package<br/>packupdate]
        B -->|MCP Integration| E[MCP Server]
        
        C --> F[npm outdated]
        D --> F
        E --> C
        E --> D
        
        F --> G[Dependency Resolution]
        G --> H[Package Installation]
        H --> I[Testing & Validation]
        I --> J[Logging System]
        
        J --> K[Log Files<br/>logs/packupdate-*.log]
    end
    
    subgraph "External Dependencies"
        L[npm Registry]
        M[Node.js Project]
        N[package.json]
        O[Test Scripts]
    end
    
    H --> L
    F --> N
    I --> O
    H --> M
```

## Package Update Flow

```mermaid
flowchart TD
    A[Start PackUpdate] --> B[Parse Arguments]
    B --> C{Check Flags}
    C -->|--version| D[Show Version]
    C -->|--type| E[Show Type]
    C -->|--help| F[Show Help]
    C -->|Update Mode| G[Validate Project Path]
    
    G --> H[Run npm outdated --json]
    H --> I{Packages Found?}
    I -->|No| J[No Updates Needed]
    I -->|Yes| K[Parse Outdated Packages]
    
    K --> L[Get Dependency Tree]
    L --> M[Resolve Update Order]
    M --> N[Start Update Loop]
    
    N --> O[Select Next Package]
    O --> P{Safe Mode?}
    P -->|Yes| Q[Install Latest Version]
    P -->|No| R[Install Wanted Version]
    
    Q --> S[Run Tests]
    S --> T{Tests Pass?}
    T -->|Yes| U[Log Success]
    T -->|No| V[Revert & Try Wanted]
    V --> W{Tests Pass?}
    W -->|Yes| U
    W -->|No| X[Revert & Log Failure]
    
    R --> Y[Run Tests if Available]
    Y --> Z{Tests Pass?}
    Z -->|Yes| U
    Z -->|No| X
    
    U --> AA{More Packages?}
    X --> AA
    AA -->|Yes| O
    AA -->|No| BB[Generate Summary]
    BB --> CC[Write Final Logs]
    CC --> DD[End]
    
    D --> DD
    E --> DD
    F --> DD
    J --> DD
```

## Dependency Resolution Algorithm

```mermaid
graph TD
    A[Outdated Packages List] --> B[Build Dependency Graph]
    B --> C[Initialize Visited Set]
    C --> D[Start DFS Traversal]
    
    D --> E[Visit Package]
    E --> F{Already Visited?}
    F -->|Yes| G[Skip Package]
    F -->|No| H[Mark as Visited]
    
    H --> I[Get Package Dependencies]
    I --> J{Has Outdated Dependencies?}
    J -->|Yes| K[Visit Dependencies First]
    J -->|No| L[Add to Update Order]
    
    K --> E
    G --> M{More Packages?}
    L --> M
    M -->|Yes| N[Next Package]
    M -->|No| O[Return Ordered List]
    
    N --> E
    O --> P[Execute Updates in Order]
```

## MCP Server Integration Architecture

```mermaid
graph TB
    subgraph "AI Assistant (Q CLI)"
        A[User Query] --> B[Natural Language Processing]
        B --> C[Intent Recognition]
        C --> D[MCP Client]
    end
    
    subgraph "MCP Protocol Layer"
        D --> E[JSON-RPC 2.0]
        E --> F[Tool Discovery]
        E --> G[Tool Execution]
    end
    
    subgraph "PackUpdate MCP Server"
        F --> H[List Available Tools]
        G --> I{Tool Selection}
        
        I -->|update_packages| J[Package Update Tool]
        I -->|get_packupdate_version| K[Version Check Tool]
        I -->|get_update_logs| L[Log Retrieval Tool]
        I -->|list_outdated_packages| M[Package List Tool]
    end
    
    subgraph "PackUpdate Core"
        J --> N[Auto-detect Project Type]
        N --> O{Project Type}
        O -->|Node.js| P[Call updatenpmpackages]
        O -->|Python| Q[Call packupdate]
        
        K --> R[Check Installed Versions]
        L --> S[Read Log Files]
        M --> T[Run npm outdated]
    end
    
    subgraph "File System"
        P --> U[Execute npm commands]
        Q --> U
        S --> V[logs/*.log files]
        T --> W[package.json]
    end
    
    subgraph "Response Flow"
        U --> X[Capture Output]
        V --> X
        W --> X
        R --> X
        X --> Y[Format Response]
        Y --> Z[Return to AI Assistant]
    end
```

## MCP Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Assistant (Q CLI)
    participant MCP as MCP Client
    participant Server as MCP Server
    participant Core as PackUpdate Core
    participant NPM as npm/filesystem
    
    User->>AI: "Update packages in my project"
    AI->>MCP: Parse intent & identify tools needed
    MCP->>Server: tools/list (discover available tools)
    Server->>MCP: Return tool definitions
    
    MCP->>Server: tools/call update_packages
    Note over MCP,Server: {project_path: "/path", safe_mode: true}
    
    Server->>Core: Detect project type
    Core->>NPM: Check package.json
    NPM->>Core: Project type confirmed
    
    Server->>Core: Execute updatenpmpackages
    Core->>NPM: npm outdated --json
    NPM->>Core: Outdated packages list
    
    Core->>NPM: npm install package@version
    NPM->>Core: Installation result
    
    Core->>NPM: npm test (if safe mode)
    NPM->>Core: Test results
    
    Core->>NPM: Write logs
    NPM->>Core: Log file created
    
    Core->>Server: Return execution results
    Server->>MCP: Formatted response with logs
    MCP->>AI: Tool execution complete
    AI->>User: "Packages updated successfully. Log: ..."
```

## Data Flow Diagram

```mermaid
graph LR
    subgraph "Input Data"
        A[Project Path]
        B[CLI Arguments]
        C[package.json]
    end
    
    subgraph "Processing"
        D[Argument Parser]
        E[Project Validator]
        F[Package Scanner]
        G[Dependency Resolver]
        H[Update Engine]
        I[Test Runner]
        J[Logger]
    end
    
    subgraph "Output Data"
        K[Updated Packages]
        L[Log Files]
        M[Console Output]
        N[Exit Code]
    end
    
    A --> E
    B --> D
    C --> F
    
    D --> H
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    
    H --> K
    J --> L
    J --> M
    I --> N
```

## Error Handling Flow

```mermaid
graph TD
    A[Operation Start] --> B{Try Operation}
    B -->|Success| C[Log Success]
    B -->|Error| D[Catch Exception]
    
    D --> E{Error Type}
    E -->|Network Error| F[Retry Logic]
    E -->|Permission Error| G[Log Error & Skip]
    E -->|Test Failure| H[Revert Package]
    E -->|Invalid Path| I[Exit with Error]
    
    F --> J{Retry Count < Max?}
    J -->|Yes| K[Wait & Retry]
    J -->|No| G
    K --> B
    
    H --> L[Install Previous Version]
    L --> M[Log Revert Action]
    
    C --> N[Continue to Next]
    G --> N
    M --> N
    I --> O[Exit Process]
    N --> P{More Operations?}
    P -->|Yes| A
    P -->|No| Q[Complete Successfully]
```

## Key Components

### Core Components
- **Argument Parser**: Handles CLI arguments and flags
- **Project Validator**: Ensures valid Node.js project structure
- **Package Scanner**: Uses `npm outdated` to find updates
- **Dependency Resolver**: Orders updates based on dependencies
- **Update Engine**: Executes package installations
- **Test Runner**: Validates updates with project tests
- **Logger**: Creates detailed audit trails

### MCP Integration
- **Tool Discovery**: Exposes available PackUpdate operations
- **Auto-detection**: Identifies project type automatically
- **Response Formatting**: Structures output for AI consumption
- **Error Handling**: Provides meaningful error messages

### Safety Features
- **Safe Mode**: Tests before permanent installation
- **Rollback**: Reverts failed updates
- **Dependency Ordering**: Prevents dependency conflicts
- **Comprehensive Logging**: Full audit trail for troubleshooting
