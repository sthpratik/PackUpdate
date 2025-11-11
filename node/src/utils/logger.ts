/**
 * Logging utilities for PackUpdate
 */
import * as fs from "fs";
import * as path from "path";

const LOG_DIR = "logs";
const LOG_FILE = path.join(LOG_DIR, `packupdate-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
const DETAILED_LOG_FILE = path.join(LOG_DIR, `packupdate-detailed-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);

let QUIET_MODE = false;

/**
 * Set quiet mode for logging
 */
export const setQuietMode = (quiet: boolean): void => {
  QUIET_MODE = quiet;
};

/**
 * Write message to log file with timestamp
 */
export const writeLog = (message: string): void => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
};

/**
 * Write detailed message to detailed log file only
 */
export const writeDetailedLog = (message: string): void => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(DETAILED_LOG_FILE, logEntry);
  
  // DO NOT write to regular log - keep summary clean
};

/**
 * Log message to console (respects quiet mode) and detailed log
 */
export const log = (message: string): void => {
  if (!QUIET_MODE) console.log(message);
  writeDetailedLog(`CONSOLE: ${message}`);
  // DO NOT write to summary log automatically
};

/**
 * Log command execution details (detailed log only)
 */
export const logCommand = (command: string, args: string[], cwd: string, result?: any): void => {
  const commandStr = `${command} ${args.join(' ')}`;
  writeDetailedLog(`COMMAND: ${commandStr} (cwd: ${cwd})`);
  
  if (result) {
    writeDetailedLog(`COMMAND_RESULT: Exit code: ${result.status || result.code || 'unknown'}`);
    
    if (result.stdout && result.stdout.trim()) {
      writeDetailedLog(`STDOUT:\n${result.stdout.trim()}`);
    }
    
    if (result.stderr && result.stderr.trim()) {
      writeDetailedLog(`STDERR:\n${result.stderr.trim()}`);
    }
    
    // Log success/failure
    const success = (result.status || result.code) === 0;
    writeDetailedLog(`COMMAND_STATUS: ${success ? 'SUCCESS' : 'FAILED'}`);
  }
};

/**
 * Log package operation details (detailed log only)
 */
export const logPackageOperation = (operation: string, packageName: string, version: string, details?: string): void => {
  writeDetailedLog(`PACKAGE_OP: ${operation} - ${packageName}@${version}${details ? ` - ${details}` : ''}`);
};

/**
 * Log test execution details (detailed log only)
 */
export const logTestExecution = (scriptName: string, success: boolean, output?: string): void => {
  writeDetailedLog(`TEST: ${scriptName} - ${success ? 'PASSED' : 'FAILED'}`);
  if (output) writeDetailedLog(`TEST_OUTPUT: ${output}`);
};

/**
 * Get current log file path
 */
export const getLogFile = (): string => LOG_FILE;

/**
 * Get detailed log file path
 */
export const getDetailedLogFile = (): string => DETAILED_LOG_FILE;

/**
 * Get log directory path
 */
export const getLogDir = (): string => LOG_DIR;
