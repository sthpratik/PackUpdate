/**
 * Package update orchestration
 */
import { UpdateResult } from "../types";
import { log, writeLog } from "../utils/logger";
import { getOutdatedPackages, getDependencyTree, installPackage } from "./packageService";
import { resolveUpdateOrder } from "./dependencyService";
import { runTests } from "./testService";
import { getSafePackagesForUpdate } from "./reportService";

/**
 * Prioritize packages for safe-first updating
 * @param updateOrder Original update order
 * @param safePackages List of safe packages
 * @returns Reordered list with safe packages first
 */
const prioritizeSafePackages = (updateOrder: string[], safePackages: string[]): string[] => {
  const safeInOrder = updateOrder.filter(pkg => safePackages.includes(pkg));
  const riskyInOrder = updateOrder.filter(pkg => !safePackages.includes(pkg));
  
  log(`\n🔍 UPDATE PRIORITIZATION:`);
  log(`✅ Safe packages (no breaking changes): ${safeInOrder.length}`);
  log(`⚠️  Risky packages (potential breaking changes): ${riskyInOrder.length}`);
  
  return [...safeInOrder, ...riskyInOrder];
};

/**
 * Update packages in a single pass
 * @param projectPath Path to project
 * @param safeMode Whether to run tests after each update
 * @param minorOnly Whether to only update minor versions
 * @param quietMode Whether to suppress output
 * @returns Update results
 */
export const updatePackagesInPass = (
  projectPath: string, 
  safeMode: boolean, 
  minorOnly: boolean = false,
  quietMode: boolean = false
): UpdateResult => {
  const outdatedPackages = getOutdatedPackages(projectPath, minorOnly);
  if (Object.keys(outdatedPackages).length === 0) {
    log("No outdated packages found.");
    return { updated: [], failed: [] };
  }

  const dependencyTree = getDependencyTree(projectPath);
  const originalOrder = resolveUpdateOrder(outdatedPackages, dependencyTree);
  
  // Get safe packages and prioritize them (pass outdated packages to avoid double call)
  const safePackages = getSafePackagesForUpdate(outdatedPackages, projectPath);
  const updateOrder = prioritizeSafePackages(originalOrder, safePackages);
  
  log("\nFinal Update Order: " + updateOrder.join(", "));

  const updated: [string, string, string][] = [];
  const failed: string[] = [];

  for (const pkg of updateOrder) {
    const details = outdatedPackages[pkg];
    const { current, wanted, latest } = details;
    const originalVersion = current; // Store the actual original version
    const isSafe = safePackages.includes(pkg);

    log(`\n${isSafe ? '✅' : '⚠️'} Updating ${pkg} (${isSafe ? 'safe' : 'risky'})...`);
    
    let finalVersion = originalVersion;
    let updateSuccessful = false;

    if (safeMode) {
      // Try latest → wanted → current (with tests after each)
      
      // Try latest version first
      try {
        log(`  Trying latest version ${latest}...`);
        installPackage(pkg, latest, projectPath, quietMode);
        runTests(projectPath, quietMode);
        finalVersion = latest;
        updateSuccessful = true;
        log(`  ✅ Latest version ${latest} works!`);
      } catch (error) {
        log(`  ❌ Latest version ${latest} failed: ${error}`);
        
        // Try wanted version
        if (wanted !== latest && wanted !== originalVersion) {
          try {
            log(`  Trying wanted version ${wanted}...`);
            installPackage(pkg, wanted, projectPath, quietMode);
            runTests(projectPath, quietMode);
            finalVersion = wanted;
            updateSuccessful = true;
            log(`  ✅ Wanted version ${wanted} works!`);
          } catch (error) {
            log(`  ❌ Wanted version ${wanted} failed: ${error}`);
          }
        }
        
        // Revert to original version if both failed
        if (!updateSuccessful) {
          try {
            log(`  Reverting to original version ${originalVersion}...`);
            installPackage(pkg, originalVersion, projectPath, quietMode);
            runTests(projectPath, quietMode);
            finalVersion = originalVersion;
            log(`  ✅ Reverted to original version ${originalVersion}`);
          } catch (error) {
            log(`  ❌ Even revert failed: ${error}`);
            failed.push(pkg);
            writeLog(`FAILED: ${pkg} update failed completely`);
            continue;
          }
        }
      }
    } else {
      // Without safe mode, just try latest
      try {
        installPackage(pkg, latest, projectPath, quietMode);
        finalVersion = latest;
        updateSuccessful = true;
      } catch (error) {
        const errorMsg = `Failed to update ${pkg}: ${error}`;
        console.error(errorMsg);
        writeLog(`ERROR: ${errorMsg}`);
        failed.push(pkg);
        writeLog(`FAILED: ${pkg} update failed`);
        continue;
      }
    }

    // Only add to updated list if version actually changed
    if (updateSuccessful && finalVersion !== originalVersion) {
      updated.push([pkg, originalVersion, finalVersion]);
      writeLog(`SUCCESS: Updated ${pkg} from ${originalVersion} to ${finalVersion} (${isSafe ? 'safe' : 'risky'})`);
      log(`${pkg} updated successfully from ${originalVersion} to ${finalVersion}.`);
    } else if (finalVersion === originalVersion) {
      log(`${pkg} remains at original version ${originalVersion}.`);
      // Don't add to updated list if no change occurred
    }
  }

  return { updated, failed };
};

/**
 * Print final summary of all update results
 * @param allResults Results from all passes
 * @param passes Number of passes executed
 */
export const printFinalSummary = (allResults: UpdateResult[], passes: number): void => {
  log("\nFinal Update Summary:");
  log(`${"Package".padEnd(40)} ${"Old Version".padEnd(10)} ${"New Version".padEnd(10)}`);
  log("-".repeat(60));

  allResults.forEach((result, passIndex) => {
    log(`\n=== Pass ${passIndex + 1} ===`);
    result.updated.forEach(([pkg, oldVersion, newVersion]) => {
      log(`${pkg.padEnd(40)} ${oldVersion.padEnd(10)} ${newVersion.padEnd(10)}`);
    });
  });

  const allFailed = allResults.flatMap((result) => result.failed);
  if (allFailed.length > 0) {
    log("\nPackages that failed to update:");
    allFailed.forEach((pkg) => log(`- ${pkg}`));
  }
};
