/**
 * CLI argument parsing and help display
 */
import * as fs from "fs";
import * as path from "path";
import { CliArgs } from "../types";

/**
 * Parse command line arguments
 * @returns Parsed CLI arguments
 */
export const parseCliArgs = (): CliArgs => {
  const args = process.argv.slice(2);
  const flags = args.filter(arg => arg.startsWith('--'));
  const nonFlags = args.filter(arg => !arg.startsWith('--'));
  
  const passArg = flags.find((arg) => arg.startsWith("--pass="));
  
  return {
    projectPath: nonFlags[0] || process.cwd(),
    safeMode: flags.includes("--safe"),
    minorOnly: flags.includes("--minor-only"),
    generateReport: flags.includes("--generate-report"),
    removeUnused: flags.includes("--remove-unused"),
    dedupePackages: flags.includes("--dedupe-packages"),
    quietMode: flags.includes("--quiet"),
    passes: passArg ? parseInt(passArg.split("=")[1], 10) : 1
  };
};

/**
 * Check for special flags that don't require main execution
 * @returns True if special flag was handled
 */
export const handleSpecialFlags = (): boolean => {
  const args = process.argv.slice(2);
  const flags = args.filter(arg => arg.startsWith('--'));
  
  if (flags.includes("--help")) {
    showHelp();
    return true;
  }
  
  if (flags.includes("--version")) {
    showVersion();
    return true;
  }
  
  if (flags.includes("--type")) {
    console.log("nodejs");
    return true;
  }
  
  return false;
};

/**
 * Display help message
 */
const showHelp = (): void => {
  console.log(`
PackUpdate - Node.js Package Updater

Usage: updatenpmpackages [project_path] [options]

Arguments:
  project_path              Path to the Node.js project (default: current directory)

Options:
  --safe                   Enable safe mode (test updates before applying)
  --quiet                  Enable quiet mode (minimal console output)
  --minor-only             Update only minor versions (1.2.x → 1.3.x, skip major updates)
  --generate-report        Generate comprehensive security & dependency report (no updates)
  --remove-unused          Clean up unused dependencies
  --dedupe-packages        Remove duplicate dependencies
  --pass=<number>          Number of update passes (default: 1)
  --version                Show package version
  --type                   Show package type (nodejs)
  --help                   Show this help message

Examples:
  updatenpmpackages                           # Update current directory
  updatenpmpackages /path/to/project         # Update specific project
  updatenpmpackages --safe --quiet           # Safe and quiet mode
  updatenpmpackages --minor-only             # Only minor version updates
  updatenpmpackages --generate-report        # Generate security & dependency report
  updatenpmpackages --remove-unused          # Remove unused dependencies
  updatenpmpackages --dedupe-packages        # Remove duplicate dependencies
  updatenpmpackages --pass=3                 # Multiple passes
  updatenpmpackages --version                # Show version
`);
};

/**
 * Show package version
 */
const showVersion = (): void => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));
  console.log(packageJson.version);
};
