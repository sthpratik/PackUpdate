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

const printOutdatedPackages = (outdatedPackages: Record<string, OutdatedPackage>): void => {
  console.log("\nOutdated Packages:");
  console.log(`${"Package".padEnd(40)} ${"Current".padEnd(10)} ${"Wanted".padEnd(10)} ${"Latest".padEnd(10)}`);
  console.log("-".repeat(70));
  for (const [pkg, details] of Object.entries(outdatedPackages)) {
    console.log(
      `${pkg.padEnd(40)} ${details.current.padEnd(10)} ${details.wanted.padEnd(10)} ${details.latest.padEnd(10)}`
    );
  }
  console.log("-".repeat(70));
};

const getOutdatedPackages = (projectPath: string): Record<string, OutdatedPackage> => {
  const result = spawnSync("npm", ["outdated", "--json"], { cwd: projectPath, encoding: "utf-8" });

  if (result.error) {
    console.error("Error running npm outdated:", result.error);
    return {};
  }

  if (result.stdout) {
    try {
      const outdatedPackages = JSON.parse(result.stdout);
      printOutdatedPackages(outdatedPackages);
      return outdatedPackages;
    } catch (parseError) {
      console.error("Error parsing npm outdated output:", parseError);
    }
  }

  if (result.stderr) {
    console.error("npm outdated stderr:", result.stderr);
  }

  return {};
};

const getDependencyTree = (projectPath: string): Record<string, any> => {
  const result = spawnSync("npm", ["ls", "--json"], { cwd: projectPath, encoding: "utf-8" });

  if (result.error) {
    console.error("Error running npm ls:", result.error);
    return {};
  }

  try {
    return JSON.parse(result.stdout);
  } catch (parseError) {
    console.error("Error parsing npm ls output:", parseError);
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
      const result = spawnSync("npm", ["run", scriptName], { cwd: projectPath, stdio: "inherit" });
      return result.status === 0;
    } else {
      console.log(`No ${scriptName} script found in package.json. Skipping.`);
      return true;
    }
  } catch (error) {
    console.error("Error reading package.json:", error);
    return false;
  }
};

const runTests = (projectPath: string): void => {
  console.log("\nRunning build...");
  if (!executeScriptIfExists(projectPath, "build")) throw new Error("Build failed.");

  console.log("\nRunning tests...");
  if (!executeScriptIfExists(projectPath, "test")) throw new Error("Tests failed.");
};

const installPackage = (packageName: string, version: string, projectPath: string): void => {
  console.log(`\nInstalling ${packageName}@${version}...`);
  const result = spawnSync("npm", ["install", `${packageName}@${version}`], { cwd: projectPath, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`Failed to install ${packageName}@${version}`);
};

const updatePackagesInPass = (projectPath: string, safeMode: boolean): UpdateResult => {
  const outdatedPackages = getOutdatedPackages(projectPath);
  if (Object.keys(outdatedPackages).length === 0) {
    console.log("No outdated packages found.");
    return { updated: [], failed: [] };
  }

  const dependencyTree = getDependencyTree(projectPath);
  const updateOrder = resolveUpdateOrder(outdatedPackages, dependencyTree);
  console.log("\nUpdate Order:", updateOrder);

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
      } else {
        installPackage(pkg, wanted, projectPath);
        updated.push([pkg, current, wanted]);
      }
      console.log(`${pkg} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update ${pkg}:`, error);
      failed.push(pkg);
    }
  }

  return { updated, failed };
};

const printFinalSummary = (allResults: UpdateResult[], passes: number): void => {
  console.log("\nFinal Update Summary:");
  console.log(`${"Package".padEnd(40)} ${"Old Version".padEnd(10)} ${"New Version".padEnd(10)}`);
  console.log("-".repeat(60));

  allResults.forEach((result, passIndex) => {
    console.log(`\n=== Pass ${passIndex + 1} ===`);
    result.updated.forEach(([pkg, oldVersion, newVersion]) => {
      console.log(`${pkg.padEnd(40)} ${oldVersion.padEnd(10)} ${newVersion.padEnd(10)}`);
    });
  });

  const allFailed = allResults.flatMap((result) => result.failed);
  if (allFailed.length > 0) {
    console.log("\nPackages that failed to update:");
    allFailed.forEach((pkg) => console.log(`- ${pkg}`));
  }
};

const main = (): void => {
  const projectPath = process.argv[2] || process.cwd();
  const safeMode = process.argv.includes("--safe");
  const passArg = process.argv.find((arg) => arg.startsWith("--pass="));
  const passes = passArg ? parseInt(passArg.split("=")[1], 10) : 1;

  if (!fs.existsSync(projectPath) || !fs.lstatSync(projectPath).isDirectory()) {
    console.error(`Invalid project path: ${projectPath}`);
    process.exit(1);
  }

  const allResults: UpdateResult[] = [];
  for (let i = 0; i < passes; i++) {
    console.log(`\n=== Pass ${i + 1} ===`);
    const result = updatePackagesInPass(projectPath, safeMode);
    allResults.push(result);

    if (result.updated.length === 0) {
      console.log("No more outdated packages found.");
      break;
    }
  }

  printFinalSummary(allResults, passes);
};

main();
