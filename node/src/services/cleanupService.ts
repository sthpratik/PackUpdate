/**
 * Package cleanup operations
 */
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { log, writeLog } from "../utils/logger";

/**
 * Remove unused dependencies from project
 * @param projectPath Path to project
 * @param quietMode Whether to suppress output
 * @returns Array of removed packages
 */
export const removeUnusedPackages = (projectPath: string, quietMode: boolean): string[] => {
  log("\n=== Removing Unused Dependencies ===");
  
  // Use depcheck to find unused dependencies
  const depcheckResult = spawnSync("npx", ["depcheck", "--json"], { 
    cwd: projectPath, 
    encoding: "utf-8" 
  });
  
  let unusedPackages: string[] = [];
  
  try {
    const depcheckData = JSON.parse(depcheckResult.stdout || "{}");
    unusedPackages = depcheckData.dependencies || [];
    
    if (unusedPackages.length === 0) {
      log("✅ No unused dependencies found.");
      return [];
    }
    
    log(`📦 Found ${unusedPackages.length} unused dependencies:`);
    unusedPackages.forEach(pkg => log(`  - ${pkg}`));
    
    // Remove unused packages
    const removedPackages: string[] = [];
    for (const pkg of unusedPackages) {
      try {
        log(`🗑️  Removing ${pkg}...`);
        const result = spawnSync("npm", ["uninstall", pkg], { 
          cwd: projectPath, 
          stdio: quietMode ? "pipe" : "inherit" 
        });
        
        if (result.status === 0) {
          removedPackages.push(pkg);
          writeLog(`SUCCESS: Removed unused package ${pkg}`);
        } else {
          writeLog(`ERROR: Failed to remove ${pkg}`);
        }
      } catch (error) {
        writeLog(`ERROR: Failed to remove ${pkg}: ${error}`);
      }
    }
    
    log(`✅ Removed ${removedPackages.length} unused dependencies.`);
    return removedPackages;
    
  } catch (error) {
    // Fallback: analyze package.json vs actual usage
    log("⚠️  Depcheck not available, using basic analysis...");
    return removeUnusedBasicAnalysis(projectPath, quietMode);
  }
};

/**
 * Basic unused package analysis when depcheck is not available
 */
const removeUnusedBasicAnalysis = (projectPath: string, quietMode: boolean): string[] => {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) return [];
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const dependencies = Object.keys(packageJson.dependencies || {});
    
    // Simple heuristic: check if package is imported in common files
    const commonFiles = ["src", "lib", "index.js", "index.ts", "app.js", "app.ts"];
    const potentiallyUnused: string[] = [];
    
    for (const dep of dependencies) {
      let found = false;
      for (const file of commonFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, "utf-8").toLowerCase();
          if (content.includes(dep.toLowerCase())) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        potentiallyUnused.push(dep);
      }
    }
    
    if (potentiallyUnused.length > 0) {
      log(`⚠️  Potentially unused packages (manual review recommended):`);
      potentiallyUnused.forEach(pkg => log(`  - ${pkg}`));
    }
    
    return []; // Don't auto-remove with basic analysis
  } catch (error) {
    writeLog(`ERROR: Basic analysis failed: ${error}`);
    return [];
  }
};

/**
 * Remove duplicate dependencies
 * @param projectPath Path to project
 * @param quietMode Whether to suppress output
 * @returns Number of deduplicated packages
 */
export const dedupePackages = (projectPath: string, quietMode: boolean): number => {
  log("\n=== Deduplicating Dependencies ===");
  
  try {
    // Run npm dedupe
    log("🔄 Running npm dedupe...");
    const result = spawnSync("npm", ["dedupe"], { 
      cwd: projectPath, 
      stdio: quietMode ? "pipe" : "inherit" 
    });
    
    if (result.status === 0) {
      log("✅ Dependencies deduplicated successfully.");
      writeLog("SUCCESS: npm dedupe completed");
      
      // Get dedupe statistics
      const auditResult = spawnSync("npm", ["ls", "--depth=0"], { 
        cwd: projectPath, 
        encoding: "utf-8" 
      });
      
      // Count unique packages (simplified)
      const lines = auditResult.stdout?.split('\n') || [];
      const packageCount = lines.filter(line => line.includes('├──') || line.includes('└──')).length;
      
      log(`📦 ${packageCount} unique packages remaining.`);
      return packageCount;
    } else {
      const errorMsg = "npm dedupe failed";
      log(`❌ ${errorMsg}`);
      writeLog(`ERROR: ${errorMsg}`);
      return 0;
    }
  } catch (error) {
    const errorMsg = `Dedupe failed: ${error}`;
    log(`❌ ${errorMsg}`);
    writeLog(`ERROR: ${errorMsg}`);
    return 0;
  }
};

/**
 * Clean up package-lock.json and node_modules
 * @param projectPath Path to project
 * @param quietMode Whether to suppress output
 */
export const cleanupPackageFiles = (projectPath: string, quietMode: boolean): void => {
  log("\n=== Cleaning Package Files ===");
  
  try {
    // Remove node_modules and package-lock.json
    const nodeModulesPath = path.join(projectPath, "node_modules");
    const packageLockPath = path.join(projectPath, "package-lock.json");
    
    if (fs.existsSync(nodeModulesPath)) {
      log("🗑️  Removing node_modules...");
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    }
    
    if (fs.existsSync(packageLockPath)) {
      log("🗑️  Removing package-lock.json...");
      fs.unlinkSync(packageLockPath);
    }
    
    // Fresh install
    log("📦 Running fresh npm install...");
    const result = spawnSync("npm", ["install"], { 
      cwd: projectPath, 
      stdio: quietMode ? "pipe" : "inherit" 
    });
    
    if (result.status === 0) {
      log("✅ Fresh installation completed.");
      writeLog("SUCCESS: Package files cleaned and reinstalled");
    } else {
      throw new Error("npm install failed");
    }
  } catch (error) {
    const errorMsg = `Cleanup failed: ${error}`;
    log(`❌ ${errorMsg}`);
    writeLog(`ERROR: ${errorMsg}`);
  }
};
