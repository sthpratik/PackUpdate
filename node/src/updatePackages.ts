#!/usr/bin/env node
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface OutdatedPackage {
  current: string;
  wanted: string;
  latest: string;
}

interface UpdateResult {
  updated: [string, string, string][]; // [packageName, oldVersion, newVersion]
  failed: string[]; // List of failed packages
}

const LOG_DIR = "logs";
const LOG_FILE = path.join(LOG_DIR, `packupdate-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
let QUIET_MODE = false;

const writeLog = (message: string): void => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
};

const log = (message: string): void => {
  if (!QUIET_MODE) console.log(message);
};

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

const getOutdatedPackages = (projectPath: string): Record<string, OutdatedPackage> => {
  const result = spawnSync("npm", ["outdated", "--json"], { cwd: projectPath, encoding: "utf-8" });

  if (result.error) {
    const errorMsg = `Error running npm outdated: ${result.error}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    return {};
  }

  if (result.stdout) {
    try {
      const outdatedPackages = JSON.parse(result.stdout);
      writeLog(`Found ${Object.keys(outdatedPackages).length} outdated packages: ${Object.keys(outdatedPackages).join(', ')}`);
      printOutdatedPackages(outdatedPackages);
      return outdatedPackages;
    } catch (parseError) {
      const errorMsg = `Error parsing npm outdated output: ${parseError}`;
      console.error(errorMsg);
      writeLog(`ERROR: ${errorMsg}`);
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

const getDependencyTree = (projectPath: string): Record<string, any> => {
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

const resolveUpdateOrder = (
  outdatedPackages: Record<string, OutdatedPackage>,
  dependencyTree: Record<string, any>
): string[] => {
  const resolvedOrder: string[] = [];
  const visited = new Set<string>();

  const visit = (packageName: string): void => {
    if (visited.has(packageName)) return;
    visited.add(packageName);

    const dependencies = dependencyTree.dependencies?.[packageName]?.requires || {};
    for (const dep of Object.keys(dependencies)) {
      if (outdatedPackages[dep]) visit(dep);
    }
    resolvedOrder.push(packageName);
  };

  for (const pkg of Object.keys(outdatedPackages)) {
    visit(pkg);
  }

  return resolvedOrder;
};

const executeScriptIfExists = (projectPath: string, scriptName: string): boolean => {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) return false;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      const result = spawnSync("npm", ["run", scriptName], { 
        cwd: projectPath, 
        stdio: QUIET_MODE ? "pipe" : "inherit" 
      });
      return result.status === 0;
    } else {
      log(`No ${scriptName} script found in package.json. Skipping.`);
      return true;
    }
  } catch (error) {
    const errorMsg = `Error reading package.json: ${error}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    return false;
  }
};

const runTests = (projectPath: string): void => {
  log("\nRunning build...");
  if (!executeScriptIfExists(projectPath, "build")) {
    const errorMsg = "Build failed.";
    writeLog(`ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  log("\nRunning tests...");
  if (!executeScriptIfExists(projectPath, "test")) {
    const errorMsg = "Tests failed.";
    writeLog(`ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
  }
};

const installPackage = (packageName: string, version: string, projectPath: string): void => {
  log(`\nInstalling ${packageName}@${version}...`);
  const result = spawnSync("npm", ["install", `${packageName}@${version}`], { 
    cwd: projectPath, 
    stdio: QUIET_MODE ? "pipe" : "inherit" 
  });
  if (result.status !== 0) {
    const errorMsg = `Failed to install ${packageName}@${version}`;
    writeLog(`ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
  }
};

const updatePackagesInPass = (projectPath: string, safeMode: boolean): UpdateResult => {
  const outdatedPackages = getOutdatedPackages(projectPath);
  if (Object.keys(outdatedPackages).length === 0) {
    log("No outdated packages found.");
    return { updated: [], failed: [] };
  }

  const dependencyTree = getDependencyTree(projectPath);
  const updateOrder = resolveUpdateOrder(outdatedPackages, dependencyTree);
  log("\nUpdate Order: " + updateOrder.join(", "));

  const updated: [string, string, string][] = [];
  const failed: string[] = [];

  for (const pkg of updateOrder) {
    const details = outdatedPackages[pkg];
    const { current, wanted, latest } = details;

    try {
      if (safeMode) {
        installPackage(pkg, latest, projectPath);
        runTests(projectPath);
        updated.push([pkg, current, latest]);
        writeLog(`SUCCESS: Updated ${pkg} from ${current} to ${latest}`);
      } else {
        installPackage(pkg, latest, projectPath);
        updated.push([pkg, current, latest]);
        writeLog(`SUCCESS: Updated ${pkg} from ${current} to ${latest}`);
      }
      log(`${pkg} updated successfully.`);
    } catch (error) {
      const errorMsg = `Failed to update ${pkg}: ${error}`;
      console.error(errorMsg);
      writeLog(`ERROR: ${errorMsg}`);
      failed.push(pkg);
      writeLog(`FAILED: ${pkg} update failed`);
    }
  }

  return { updated, failed };
};

const printFinalSummary = (allResults: UpdateResult[], passes: number): void => {
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

const showHelp = (): void => {
  console.log(`
PackUpdate - Node.js Package Updater

Usage: updatenpmpackages [project_path] [options]

Arguments:
  project_path              Path to the Node.js project (default: current directory)

Options:
  --safe                   Enable safe mode (test updates before applying)
  --quiet                  Enable quiet mode (minimal console output)
  --pass=<number>          Number of update passes (default: 1)
  --version                Show package version
  --type                   Show package type (nodejs)
  --help                   Show this help message

Examples:
  updatenpmpackages                           # Update current directory
  updatenpmpackages /path/to/project         # Update specific project
  updatenpmpackages --safe --quiet           # Safe and quiet mode
  updatenpmpackages --pass=3                 # Multiple passes
  updatenpmpackages --version                # Show version
`);
};

const main = (): void => {
  // Filter out flags to get the project path
  const args = process.argv.slice(2);
  const flags = args.filter(arg => arg.startsWith('--'));
  const nonFlags = args.filter(arg => !arg.startsWith('--'));
  
  const projectPath = nonFlags[0] || process.cwd();
  const safeMode = flags.includes("--safe");
  QUIET_MODE = flags.includes("--quiet");
  const showVersion = flags.includes("--version");
  const showType = flags.includes("--type");
  const showHelpFlag = flags.includes("--help");
  const passArg = flags.find((arg) => arg.startsWith("--pass="));
  const passes = passArg ? parseInt(passArg.split("=")[1], 10) : 1;

  // Handle help flag
  if (showHelpFlag) {
    showHelp();
    return;
  }

  // Handle version flag
  if (showVersion) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
    console.log(packageJson.version);
    return;
  }

  // Handle type flag
  if (showType) {
    console.log("nodejs");
    return;
  }

  writeLog(`PackUpdate started - Project: ${projectPath}, Safe Mode: ${safeMode}, Passes: ${passes}, Quiet: ${QUIET_MODE}`);

  if (!fs.existsSync(projectPath) || !fs.lstatSync(projectPath).isDirectory()) {
    const errorMsg = `Invalid project path: ${projectPath}`;
    console.error(errorMsg);
    writeLog(`ERROR: ${errorMsg}`);
    process.exit(1);
  }

  const allResults: UpdateResult[] = [];
  for (let i = 0; i < passes; i++) {
    log(`\n=== Pass ${i + 1} ===`);
    const result = updatePackagesInPass(projectPath, safeMode);
    allResults.push(result);

    if (result.updated.length === 0) {
      log("No more outdated packages found.");
      break;
    }
  }

  printFinalSummary(allResults, passes);
  writeLog(`PackUpdate completed - Log file: ${LOG_FILE}`);
  console.log(`Log file created: ${LOG_FILE}`);
};

main();
