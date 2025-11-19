/**
 * Package management operations
 */
import { spawnSync } from "child_process";
import { OutdatedPackage } from "../types";
import { log, writeLog, logCommand, logPackageOperation } from "../utils/logger";
import { isMinorUpdate } from "../utils/version";

/**
 * Get outdated packages from npm
 * @param projectPath Path to project
 * @param minorOnly Filter to only minor updates
 * @returns Record of outdated packages
 */
export const getOutdatedPackages = (projectPath: string, minorOnly: boolean = false): Record<string, OutdatedPackage> => {
  log(`🔍 Checking for outdated packages in: ${projectPath}`);
  const result = spawnSync("npm", ["outdated", "--json"], { cwd: projectPath, encoding: "utf-8" });

  if (result.error) {
    const errorMsg = `Error running npm outdated: ${result.error}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    return {};
  }

  // Debug: Log the raw output
  log(`📋 npm outdated stdout: ${result.stdout ? 'has content' : 'empty'}`);
  log(`📋 npm outdated stderr: ${result.stderr || 'none'}`);
  log(`📋 npm outdated exit code: ${result.status}`);

  if (result.stdout) {
    try {
      const rawData = JSON.parse(result.stdout);
      let outdatedPackages: Record<string, OutdatedPackage> = {};
      
      // Handle different npm outdated JSON formats
      for (const [pkg, details] of Object.entries(rawData)) {
        const packageDetails = details as any;
        
        // Convert to our expected format
        outdatedPackages[pkg] = {
          current: packageDetails.current || 'MISSING', // Handle missing packages
          wanted: packageDetails.wanted || packageDetails.latest,
          latest: packageDetails.latest
        };
      }
      
      if (minorOnly) {
        const filtered: Record<string, OutdatedPackage> = {};
        for (const [pkg, details] of Object.entries(outdatedPackages)) {
          if (isMinorUpdate(details.current, details.latest)) {
            filtered[pkg] = details;
          }
        }
        outdatedPackages = filtered;
        writeLog(`Filtered to ${Object.keys(outdatedPackages).length} minor updates only`);
      }
      
      writeLog(`Found ${Object.keys(outdatedPackages).length} outdated packages: ${Object.keys(outdatedPackages).join(', ')}`);
      printOutdatedPackages(outdatedPackages);
      return outdatedPackages;
    } catch (parseError) {
      const errorMsg = `Error parsing npm outdated output: ${parseError}`;
      console.error(errorMsg);
      writeLog(`ERROR: ${errorMsg}`);
      // Debug: Show raw output that failed to parse
      log(`📋 Raw output that failed to parse: ${result.stdout.substring(0, 500)}`);
    }
  } else {
    writeLog("No outdated packages found (empty npm outdated output)");
  }

  if (result.stderr) {
    const errorMsg = `npm outdated stderr: ${result.stderr}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
  }

  return {};
};

/**
 * Print outdated packages in formatted table
 */
const printOutdatedPackages = (outdatedPackages: Record<string, OutdatedPackage>): void => {
  log("\nOutdated Packages:");
  log(`${"Package".padEnd(40)} ${"Current".padEnd(10)} ${"Wanted".padEnd(10)} ${"Latest".padEnd(10)}`);
  log("-".repeat(70));
  for (const [pkg, details] of Object.entries(outdatedPackages)) {
    log(
      `${pkg.padEnd(40)} ${details.current.padEnd(10)} ${details.wanted.padEnd(10)} ${details.latest.padEnd(10)}`
    );
  }
  log("-".repeat(70));
};

/**
 * Get dependency tree from npm
 */
export const getDependencyTree = (projectPath: string): Record<string, any> => {
  const result = spawnSync("npm", ["ls", "--json"], { cwd: projectPath, encoding: "utf-8" });

  if (result.error) {
    const errorMsg = `Error running npm ls: ${result.error}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    return {};
  }

  try {
    return JSON.parse(result.stdout);
  } catch (parseError) {
    const errorMsg = `Error parsing npm ls output: ${parseError}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    return {};
  }
};

/**
 * Install specific package version
 */
export const installPackage = (packageName: string, version: string, projectPath: string, quietMode: boolean): void => {
  log(`\nInstalling ${packageName}@${version}...`);
  
  const result = spawnSync("npm", ["install", `${packageName}@${version}`], { 
    cwd: projectPath, 
    stdio: "pipe", // Always capture output for logging
    encoding: "utf-8"
  });
  
  // Log command details with full output
  logCommand("npm", ["install", `${packageName}@${version}`], projectPath, result);
  logPackageOperation("INSTALL", packageName, version, `Exit code: ${result.status}`);
  
  // Show output to console if not in quiet mode
  if (!quietMode) {
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
  }
  
  if (result.status !== 0) {
    const errorMsg = `Failed to install ${packageName}@${version}`;
    writeLog(`ERROR: ${errorMsg}`);
    if (result.stderr) writeLog(`STDERR: ${result.stderr}`);
    throw new Error(errorMsg);
  }
  
  logPackageOperation("INSTALL_SUCCESS", packageName, version);
};
