# MCP Server Progress Logging Guide

This guide shows how to implement progress logging in MCP servers to provide real-time feedback to users and prevent the appearance of "hanging" operations.

## Problem

MCP servers can take time to process requests, leaving users uncertain if operations are running or have stalled. Without feedback, users may think the system has frozen.

## Solution

Implement progress logging that writes to `stderr` (visible in Q CLI logs) with:
1. Real-time status updates
2. Configurable timeouts
3. Progress indicators for long operations
4. Verbose mode via environment variables

## Implementation

### 1. Add Logging Method

```javascript
class YourMCPServer {
  constructor() {
    // Enable verbose mode via environment variables
    this.verbose = process.env.YOUR_SERVER_VERBOSE === 'true' || 
                   process.env.Q_LOG_LEVEL === 'trace';
  }

  log(message) {
    if (this.verbose) {
      console.error(`[YourServer MCP] ${new Date().toISOString()}: ${message}`);
    }
  }
}
```

### 2. Add Timeout Protection

```javascript
executeCommandWithTimeout(command, args = [], timeout = 30000, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      ...options
    });

    let stdout = "";
    let stderr = "";
    let timeoutId;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      cleanup();
      reject(new Error(`Command timed out after ${timeout}ms`));
    }, timeout);

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
      this.log(`Command output: ${data.toString().trim()}`);
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
      this.log(`Command stderr: ${data.toString().trim()}`);
    });

    child.on("close", (code) => {
      cleanup();
      resolve({ code, output: stdout, error: stderr });
    });

    child.on("error", (error) => {
      cleanup();
      reject(error);
    });
  });
}
```

### 3. Add Progress Indicators

```javascript
executeCommandWithProgress(command, args = [], description = "Running command", timeout = 60000, options = {}) {
  return new Promise((resolve, reject) => {
    this.log(`${description}...`);
    
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      ...options
    });

    let stdout = "";
    let stderr = "";
    let timeoutId;
    let progressInterval;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (progressInterval) clearInterval(progressInterval);
    };

    // Progress indicator every 5 seconds
    progressInterval = setInterval(() => {
      this.log(`${description} still running...`);
    }, 5000);

    timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      cleanup();
      reject(new Error(`${description} timed out after ${timeout}ms`));
    }, timeout);

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
      const output = data.toString().trim();
      if (output) {
        this.log(`Progress: ${output}`);
      }
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
      const output = data.toString().trim();
      if (output) {
        this.log(`Status: ${output}`);
      }
    });

    child.on("close", (code) => {
      cleanup();
      this.log(`${description} completed with exit code: ${code}`);
      resolve({ code, output: stdout, error: stderr });
    });

    child.on("error", (error) => {
      cleanup();
      this.log(`${description} failed: ${error.message}`);
      reject(error);
    });
  });
}
```

### 4. Update Tool Methods

```javascript
async yourToolMethod(args) {
  const { param1, param2 } = args;
  
  this.log(`Starting operation with params: ${JSON.stringify(args)}`);
  
  try {
    // Use progress logging for long operations
    const result = await this.executeCommandWithProgress(
      "your-command", 
      [param1, param2], 
      "Processing your operation",
      30000  // 30 second timeout
    );
    
    this.log("Operation completed successfully");
    
    return {
      content: [{
        type: "text",
        text: `Operation completed: ${result.output}`
      }]
    };
  } catch (error) {
    this.log(`Operation failed: ${error.message}`);
    throw error;
  }
}
```

## Configuration

### Q CLI MCP Configuration

Add environment variable to enable verbose logging:

```json
{
  "mcpServers": {
    "your-server": {
      "command": "node",
      "args": ["/path/to/your/server/index.js"],
      "cwd": "/path/to/your/server",
      "env": {
        "YOUR_SERVER_VERBOSE": "true"
      }
    }
  }
}
```

### Environment Variables

Users can enable verbose logging in multiple ways:

```bash
# Method 1: Server-specific verbose mode
YOUR_SERVER_VERBOSE=true q chat

# Method 2: Q CLI trace logging (enables all MCP logging)
Q_LOG_LEVEL=trace q chat

# Method 3: Monitor logs in separate terminal
tail -f $TMPDIR/qlog/qchat.log
```

## Recommended Timeouts

Choose appropriate timeouts based on operation complexity:

- **Quick checks** (version, status): 5-10 seconds
- **File operations** (read, list): 10-15 seconds  
- **Network operations** (download, API calls): 30-60 seconds
- **Heavy processing** (build, install): 60-300 seconds

## Best Practices

### 1. Log Key Operations
```javascript
this.log(`Starting ${operationName} for: ${target}`);
this.log(`Auto-detecting project type...`);
this.log(`Detected project type: ${type}`);
this.log(`Executing command: ${command} ${args.join(' ')}`);
```

### 2. Use Descriptive Messages
```javascript
// Good
this.log("Checking for outdated packages...");
this.log("Installing package updates...");

// Bad  
this.log("Running command...");
this.log("Processing...");
```

### 3. Handle Errors Gracefully
```javascript
try {
  const result = await this.executeCommandWithTimeout(cmd, args, 10000);
  this.log("Command completed successfully");
} catch (error) {
  this.log(`Command failed: ${error.message}`);
  // Return user-friendly error message
  return { content: [{ type: "text", text: `Operation failed: ${error.message}` }] };
}
```

### 4. Progress for Long Operations
```javascript
// For operations > 10 seconds, use progress indicators
if (estimatedDuration > 10000) {
  return await this.executeCommandWithProgress(cmd, args, description, timeout);
} else {
  return await this.executeCommandWithTimeout(cmd, args, timeout);
}
```

## Testing

### Test Verbose Logging
```bash
# Create test script
echo 'process.env.YOUR_SERVER_VERBOSE = "true"; import("./index.js");' > test-verbose.js
node test-verbose.js
```

### Test Timeouts
```javascript
// Add test method to your server
async testTimeout() {
  this.log("Testing timeout functionality...");
  
  try {
    // This should timeout after 2 seconds
    await this.executeCommandWithTimeout("sleep", ["5"], 2000);
  } catch (error) {
    this.log(`Timeout test passed: ${error.message}`);
  }
}
```

## User Documentation

Include in your MCP server README:

```markdown
## Progress Logging

Enable real-time progress updates to see what the server is doing:

### Enable Verbose Mode
```bash
# Server-specific logging
YOUR_SERVER_VERBOSE=true q chat

# All MCP server logging  
Q_LOG_LEVEL=trace q chat
```

### Monitor Logs
```bash
# Watch logs in real-time
tail -f $TMPDIR/qlog/qchat.log
```

### What You'll See
- Operation start/completion messages
- Progress updates every 5 seconds for long operations
- Real-time command output and errors
- Timeout warnings and error details
```

## Example Output

With verbose logging enabled, users will see:

```
[YourServer MCP] 2025-10-08T22:04:52.123Z: Starting package update for: /path/to/project
[YourServer MCP] 2025-10-08T22:04:52.124Z: Auto-detecting project type...
[YourServer MCP] 2025-10-08T22:04:52.125Z: Detected project type: nodejs
[YourServer MCP] 2025-10-08T22:04:52.126Z: Executing command: npm update
[YourServer MCP] 2025-10-08T22:04:57.127Z: Processing your operation still running...
[YourServer MCP] 2025-10-08T22:05:02.128Z: Processing your operation still running...
[YourServer MCP] 2025-10-08T22:05:05.129Z: Progress: Updated 5 packages
[YourServer MCP] 2025-10-08T22:05:08.130Z: Processing your operation completed with exit code: 0
```

This eliminates user confusion about whether operations are running or have stalled.
