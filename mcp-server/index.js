#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";

class PackUpdateMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "packupdate-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Enable verbose mode by default, can be disabled via environment variable
    this.verbose = process.env.PACKUPDATE_VERBOSE !== 'false';
    this.setupToolHandlers();
  }

  log(message) {
    if (this.verbose) {
      console.error(`[PackUpdate MCP] ${new Date().toISOString()}: ${message}`);
    }
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "update_packages",
          description: "Update packages using PackUpdate (auto-detects or specify type)",
          inputSchema: {
            type: "object",
            properties: {
              project_path: { type: "string", description: "Path to the project" },
              package_manager: { 
                type: "string", 
                enum: ["nodejs", "python", "auto"],
                description: "Package manager to use (auto-detects if not specified)", 
                default: "auto" 
              },
              safe_mode: { type: "boolean", description: "Enable safe mode", default: false },
              quiet_mode: { type: "boolean", description: "Enable quiet mode", default: false },
              passes: { type: "number", description: "Number of update passes", default: 1 }
            },
            required: ["project_path"]
          }
        },
        {
          name: "get_packupdate_version",
          description: "Get installed PackUpdate package versions",
          inputSchema: {
            type: "object",
            properties: {
              package_manager: { 
                type: "string", 
                enum: ["nodejs", "python", "both"],
                description: "Which version to check", 
                default: "both" 
              }
            }
          }
        },
        {
          name: "get_update_logs",
          description: "Get the latest PackUpdate log file contents",
          inputSchema: {
            type: "object",
            properties: {
              project_path: { type: "string", description: "Path to the project (to find logs)" }
            },
            required: ["project_path"]
          }
        },
        {
          name: "list_outdated_packages",
          description: "List outdated packages without updating",
          inputSchema: {
            type: "object",
            properties: {
              project_path: { type: "string", description: "Path to the project" }
            },
            required: ["project_path"]
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "update_packages":
            return await this.updatePackages(args);
          case "get_packupdate_version":
            return await this.getPackUpdateVersion(args);
          case "get_update_logs":
            return await this.getUpdateLogs(args);
          case "list_outdated_packages":
            return await this.listOutdatedPackages(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async updatePackages(args) {
    const { project_path, package_manager = "auto", safe_mode = false, quiet_mode = false, passes = 1 } = args;
    
    this.log(`Starting package update for: ${project_path}`);
    
    let manager = package_manager;
    
    // Auto-detect project type if not specified
    if (manager === "auto") {
      this.log("Auto-detecting project type...");
      manager = await this.detectProjectType(project_path);
      this.log(`Detected project type: ${manager}`);
    }
    
    const command = "updatenpmpackages";
    const cmdArgs = [project_path];
    
    if (safe_mode) cmdArgs.push("--safe");
    if (quiet_mode) cmdArgs.push("--quiet");
    if (passes > 1) cmdArgs.push(`--pass=${passes}`);

    this.log(`Executing command: ${command} ${cmdArgs.join(' ')}`);
    
    const result = await this.executeCommandWithProgress(command, cmdArgs, "Updating packages");
    
    this.log("Getting latest log content...");
    const logs = await this.getLatestLogContent(project_path);

    return {
      content: [
        {
          type: "text",
          text: `PackUpdate (${manager}) completed for: ${project_path}\n\nOutput:\n${result.output}\n\nLogs:\n${logs}`
        }
      ]
    };
  }

  async getPackUpdateVersion(args) {
    const { package_manager = "both" } = args;
    
    this.log(`Checking PackUpdate versions for: ${package_manager}`);
    
    let output = "PackUpdate Versions:\n";
    
    if (package_manager === "nodejs" || package_manager === "both") {
      try {
        this.log("Checking Node.js version...");
        const nodeResult = await this.executeCommandWithTimeout("updatenpmpackages", ["--version"], 5000);
        const version = nodeResult.output.trim();
        output += `- Node.js (updatenpmpackages): ${version}\n`;
      } catch (error) {
        output += `- Node.js (updatenpmpackages): Not installed\n`;
      }
    }
    
    if (package_manager === "python" || package_manager === "both") {
      try {
        this.log("Checking Python version...");
        const pythonResult = await this.executeCommandWithTimeout("updatenpmpackages", ["--version"], 5000);
        const version = pythonResult.output.trim();
        output += `- Python (packupdate): ${version}\n`;
      } catch (error) {
        output += `- Python (packupdate): Not installed\n`;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: output
        }
      ]
    };
  }

  async detectProjectType(projectPath) {
    const packageJsonPath = join(projectPath, "package.json");
    const requirementsPath = join(projectPath, "requirements.txt");
    const pyprojectPath = join(projectPath, "pyproject.toml");
    
    if (existsSync(packageJsonPath)) {
      return "nodejs";
    } else if (existsSync(requirementsPath) || existsSync(pyprojectPath)) {
      return "python";
    }
    
    // Default to nodejs if unclear
    return "nodejs";
  }

  extractNpmVersion(output) {
    const match = output.match(/updatenpmpackages@(\d+\.\d+\.\d+)/);
    return match ? match[1] : "Unknown";
  }

  extractPipVersion(output) {
    const match = output.match(/Version: (\d+\.\d+\.\d+)/);
    return match ? match[1] : "Unknown";
  }

  async listOutdatedPackages(args) {
    const { project_path } = args;
    
    this.log(`Checking outdated packages in: ${project_path}`);
    
    const result = await this.executeCommandWithTimeout("npm", ["outdated", "--json"], 10000, { cwd: project_path });
    
    try {
      const outdated = JSON.parse(result.output || "{}");
      const packages = Object.keys(outdated);
      
      if (packages.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No outdated packages found."
            }
          ]
        };
      }

      let output = "Outdated packages:\n";
      for (const [pkg, info] of Object.entries(outdated)) {
        output += `- ${pkg}: ${info.current} → ${info.latest}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text: output
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: "No outdated packages found or error parsing npm outdated output."
          }
        ]
      };
    }
  }

  async getUpdateLogs(args) {
    const { project_path } = args;
    this.log(`Retrieving logs from: ${project_path}`);
    const logs = await this.getLatestLogContent(project_path);
    
    return {
      content: [
        {
          type: "text",
          text: logs || "No log files found."
        }
      ]
    };
  }

  async getLatestLogContent(projectPath) {
    const logsDir = join(projectPath, "logs");
    
    this.log(`Looking for logs in: ${logsDir}`);
    
    if (!existsSync(logsDir)) {
      this.log("No logs directory found");
      return "No logs directory found.";
    }

    try {
      const logFiles = readdirSync(logsDir)
        .filter(file => file.startsWith("packupdate-") && file.endsWith(".log"))
        .sort()
        .reverse();

      this.log(`Found ${logFiles.length} log files`);

      if (logFiles.length === 0) {
        return "No PackUpdate log files found.";
      }

      const latestLog = join(logsDir, logFiles[0]);
      this.log(`Reading latest log: ${logFiles[0]}`);
      const content = readFileSync(latestLog, "utf-8");
      
      return `Latest log (${logFiles[0]}):\n${content}`;
    } catch (error) {
      this.log(`Error reading log files: ${error.message}`);
      return `Error reading log files: ${error.message}`;
    }
  }

  executeCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ["pipe", "pipe", "pipe"],
        ...options
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        resolve({
          code,
          output: stdout,
          error: stderr
        });
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

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
        resolve({
          code,
          output: stdout,
          error: stderr
        });
      });

      child.on("error", (error) => {
        cleanup();
        reject(error);
      });
    });
  }

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
        resolve({
          code,
          output: stdout,
          error: stderr
        });
      });

      child.on("error", (error) => {
        cleanup();
        this.log(`${description} failed: ${error.message}`);
        reject(error);
      });
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new PackUpdateMCPServer();
server.run().catch((error) => {
  console.error("MCP Server Error:", error);
  process.exit(1);
});
