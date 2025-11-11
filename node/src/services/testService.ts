/**
 * Test and build execution services
 */
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { log, writeLog, logCommand, logTestExecution } from "../utils/logger";

/**
 * Execute script if it exists in package.json
 * @param projectPath Path to project
 * @param scriptName Script name to execute
 * @param quietMode Whether to suppress output
 * @returns True if successful or script doesn't exist
 */
export const executeScriptIfExists = (projectPath: string, scriptName: string, quietMode: boolean): boolean => {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) return false;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      const result = spawnSync("npm", ["run", scriptName], { 
        cwd: projectPath, 
        stdio: "pipe", // Always capture output for logging
        encoding: "utf-8"
      });
      
      // Log command details with full output
      logCommand("npm", ["run", scriptName], projectPath, result);
      
      // Log the actual npm output to detailed log
      if (result.stdout) {
        logTestExecution(scriptName, result.status === 0, `STDOUT:\n${result.stdout}`);
      }
      if (result.stderr) {
        logTestExecution(scriptName, result.status === 0, `STDERR:\n${result.stderr}`);
      }
      
      // Show output to console if not in quiet mode
      if (!quietMode) {
        if (result.stdout) console.log(result.stdout);
        if (result.stderr) console.error(result.stderr);
      }
      
      return result.status === 0;
    } else {
      log(`No ${scriptName} script found in package.json. Skipping.`);
      logTestExecution(scriptName, true, "Script not found - skipped");
      return true;
    }
  } catch (error) {
    const errorMsg = `Error reading package.json: ${error}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    logTestExecution(scriptName, false, errorMsg);
    return false;
  }
};

/**
 * Run build and test scripts
 * @param projectPath Path to project
 * @param quietMode Whether to suppress output
 */
export const runTests = (projectPath: string, quietMode: boolean): void => {
  log("\nRunning build...");
  if (!executeScriptIfExists(projectPath, "build", quietMode)) {
    const errorMsg = "Build failed.";
    writeLog(`ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  log("\nRunning tests...");
  if (!executeScriptIfExists(projectPath, "test", quietMode)) {
    const errorMsg = "Tests failed.";
    writeLog(`ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
  }
};
