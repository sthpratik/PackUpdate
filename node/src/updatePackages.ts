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
import { InteractiveService } from "./services/interactiveService";
import { getOutdatedPackages } from "./services/packageService";
import { VersionService } from "./services/versionService";

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
  passes: number,
  updateVersion?: string
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
  
  // Update project version if requested and updates were successful
  if (updateVersion && allResults.some(result => result.updated.length > 0)) {
    VersionService.updateProjectVersion(projectPath, updateVersion, quietMode);
  }
};

/**
 * Execute interactive mode for selective package updates
 */
const executeInteractiveMode = async (projectPath: string, safeMode: boolean, quietMode: boolean, updateVersion?: string): Promise<void> => {
  try {
    log("🔍 Checking for outdated packages...");
    const outdatedPackages = getOutdatedPackages(projectPath);
    
    if (Object.keys(outdatedPackages).length === 0) {
      log("✅ All packages are up to date!");
      return;
    }

    const interactiveService = new InteractiveService();
    const selectedPackages = await interactiveService.selectPackages(outdatedPackages);
    
    if (selectedPackages.length === 0) {
      log("No packages selected for update.");
      return;
    }

    const confirmed = await interactiveService.confirmUpdates(selectedPackages);
    if (!confirmed) {
      log("Update cancelled by user.");
      return;
    }

    log("\n🚀 Starting interactive updates...");
    
    // Process selected packages
    const results: UpdateResult = { updated: [], failed: [] };
    
    for (const choice of selectedPackages) {
      const targetVersion = choice.updateType === 'major' ? choice.latest : choice.wanted;
      log(`\nUpdating ${choice.name} from ${choice.current} to ${targetVersion}...`);
      
      try {
        // Use the existing update logic from updateService
        const { execSync } = require('child_process');
        const command = `npm install ${choice.name}@${targetVersion}`;
        
        execSync(command, { cwd: projectPath, stdio: quietMode ? 'pipe' : 'inherit' });
        results.updated.push([choice.name, choice.current, targetVersion]);
        log(`✅ Successfully updated ${choice.name}`);
        
      } catch (error) {
        results.failed.push(choice.name);
        log(`❌ Failed to update ${choice.name}: ${error}`);
      }
    }

    // Print final summary
    printFinalSummary([results], 1);
    
    // Update project version if requested and updates were successful
    if (updateVersion && results.updated.length > 0) {
      VersionService.updateProjectVersion(projectPath, updateVersion, quietMode);
    }
    
  } catch (error) {
    log(`❌ Interactive mode failed: ${error}`);
    throw error;
  }
};

/**
 * Main application entry point
 */
const main = async (): Promise<void> => {
  // Handle special flags first (help, version, type)
  if (handleSpecialFlags()) {
    return;
  }

  // Parse CLI arguments
  const cliArgs = parseCliArgs();
  const { projectPath, safeMode, interactive, minorOnly, generateReport, removeUnused, dedupePackages, quietMode, passes, updateVersion } = cliArgs;

  // Set up logging
  setQuietMode(quietMode);
  writeLog(`PackUpdate started - Project: ${projectPath}, Safe Mode: ${safeMode}, Interactive: ${interactive}, Minor Only: ${minorOnly}, Generate Report: ${generateReport}, Remove Unused: ${removeUnused}, Dedupe: ${dedupePackages}, Passes: ${passes}, Update Version: ${updateVersion || 'none'}, Quiet: ${quietMode}`);

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

  // Handle interactive mode
  if (interactive) {
    await executeInteractiveMode(projectPath, safeMode, quietMode, updateVersion);
    return;
  }

  // Execute update process
  executeUpdateProcess(projectPath, safeMode, minorOnly, quietMode, passes, updateVersion);

  // Log completion
  writeLog(`PackUpdate completed - Log file: ${getLogFile()}`);
  console.log(`Log files created:`);
  console.log(`  Summary: ${getLogFile()}`);
  console.log(`  Detailed: ${getDetailedLogFile()}`);
};

// Execute main function
main().catch(error => {
  console.error('❌ Application error:', error);
  process.exit(1);
});
