#!/usr/bin/env node

// Simple test to verify MCP server tools
import { spawn } from "child_process";

function testMCPServer() {
  console.log("Testing MCP Server...");
  
  const server = spawn("node", ["index.js"], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  // Test list tools request
  const listToolsRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
  };

  server.stdin.write(JSON.stringify(listToolsRequest) + "\n");

  server.stdout.on("data", (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log("Tools available:", response.result?.tools?.map(t => t.name));
    } catch (e) {
      console.log("Raw response:", data.toString());
    }
  });

  server.stderr.on("data", (data) => {
    console.log("Server started:", data.toString());
  });

  setTimeout(() => {
    server.kill();
    console.log("Test completed");
  }, 2000);
}

testMCPServer();
