#!/usr/bin/env node
/**
 * PackUpdate - Node.js Package Updater
 * Main entry point for the application
 */
import * as fs from "fs";
import { UpdateResult } from "./types";
import { setQuietMode, writeLog, log, getLogFile, getDetailedLogFile } from "./utils/logger";
import { parseCliArgs, handleSpecialFlags } from "./utils/cli";
import { updatePackagesInPass, printFinalSummary } from "./services/updateService";
import { generateComprehensiveReport } from "./services/reportService";
import { removeUnusedPackages, dedupePackages } from "./services/cleanupService";

/**
 * Validate project path exists and is a directory
 */
const validateProjectPath = (projectPath: string): void => {
  if (!fs.existsSync(projectPath) || !fs.lstatSync(projectPath).isDirectory()) {
    const errorMsg = `Invalid project path: ${projectPath}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    process.exit(1);
  }
};

/**
 * Handle cleanup operations
 */
const handleCleanupOperations = (
  projectPath: string, 
  removeUnused: boolean, 
  dedupe: boolean, 
  quietMode: boolean
): void => {
  log("\n=== Package Cleanup Operations ===");
  
  if (removeUnused) {
    const removedPackages = removeUnusedPackages(projectPath, quietMode);
    log(`\n✅ Cleanup Summary: Removed ${removedPackages.length} unused packages`);
  }
  
  if (dedupe) {
    const packageCount = dedupePackages(projectPath, quietMode);
    log(`\n✅ Dedupe Summary: ${packageCount} unique packages remaining`);
  }
  
  writeLog(`Cleanup operations completed - Log file: ${getLogFile()}`);
  console.log(`Log files created:`);
  console.log(`  Summary: ${getLogFile()}`);
  console.log(`  Detailed: ${getDetailedLogFile()}`);
};

/**
 * Execute update process with multiple passes
 */
const executeUpdateProcess = (
  projectPath: string, 
  safeMode: boolean, 
  minorOnly: boolean, 
  quietMode: boolean, 
  passes: number
): void => {
  const allResults: UpdateResult[] = [];
  
  for (let i = 0; i < passes; i++) {
    log(`\n=== Pass ${i + 1} ===`);
    const result = updatePackagesInPass(projectPath, safeMode, minorOnly, quietMode);
    allResults.push(result);

    if (result.updated.length === 0) {
      log("No more outdated packages found.");
      break;
    }
  }

  printFinalSummary(allResults, passes);
};

/**
 * Main application entry point
 */
const main = (): void => {
  // Handle special flags first (help, version, type)
  if (handleSpecialFlags()) {
    return;
  }

  // Parse CLI arguments
  const cliArgs = parseCliArgs();
  const { projectPath, safeMode, minorOnly, generateReport, removeUnused, dedupePackages, quietMode, passes } = cliArgs;

  // Set up logging
  setQuietMode(quietMode);
  writeLog(`PackUpdate started - Project: ${projectPath}, Safe Mode: ${safeMode}, Minor Only: ${minorOnly}, Generate Report: ${generateReport}, Remove Unused: ${removeUnused}, Dedupe: ${dedupePackages}, Passes: ${passes}, Quiet: ${quietMode}`);

  // Validate project path
  validateProjectPath(projectPath);

  // Handle cleanup operations
  if (removeUnused || dedupePackages) {
    handleCleanupOperations(projectPath, removeUnused, dedupePackages, quietMode);
    return;
  }

  // Handle report generation (no updates)
  if (generateReport) {
    generateComprehensiveReport(projectPath);
    return;
  }

  // Execute update process
  executeUpdateProcess(projectPath, safeMode, minorOnly, quietMode, passes);

  // Log completion
  writeLog(`PackUpdate completed - Log file: ${getLogFile()}`);
  console.log(`Log files created:`);
  console.log(`  Summary: ${getLogFile()}`);
  console.log(`  Detailed: ${getDetailedLogFile()}`);
};

// Execute main function
main();
