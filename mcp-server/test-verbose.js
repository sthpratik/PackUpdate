#!/usr/bin/env node

// Test script to verify verbose logging
process.env.PACKUPDATE_VERBOSE = 'true';

import('./index.js').then(() => {
  console.log('MCP Server started with verbose logging enabled');
}).catch(error => {
  console.error('Error starting MCP server:', error);
});
