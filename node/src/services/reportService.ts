/**
 * Security and dependency report generation
 */
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { SecurityReport, DependencyReport, ComprehensiveReport } from "../types";
import { log, writeLog, getLogDir } from "../utils/logger";
import { getOutdatedPackages } from "./packageService";
import { findCircularDependencies } from "./dependencyService";

/**
 * Generate security audit report
 * @param projectPath Path to project
 * @returns Security report data
 */
export const generateSecurityReport = (projectPath: string): SecurityReport => {
  const auditResult = spawnSync("npm", ["audit", "--json"], { cwd: projectPath, encoding: "utf-8" });
  try {
    return JSON.parse(auditResult.stdout || "{}");
  } catch {
    return {};
  }
};

/**
 * Generate dependency tree report
 * @param projectPath Path to project
 * @returns Dependency report data
 */
export const generateDependencyReport = (projectPath: string): DependencyReport => {
  const lsResult = spawnSync("npm", ["ls", "--json", "--all"], { cwd: projectPath, encoding: "utf-8" });
  try {
    return JSON.parse(lsResult.stdout || "{}");
  } catch {
    return {};
  }
};

/**
 * Check for breaking changes in package updates
 * @param packageName Package to check
 * @param currentVersion Current version
 * @param latestVersion Latest version
 * @returns Breaking change analysis
 */
const checkBreakingChanges = (packageName: string, currentVersion: string, latestVersion: string): any => {
  // Check if major version change (likely breaking)
  const currentMajor = parseInt(currentVersion.split('.')[0]);
  const latestMajor = parseInt(latestVersion.split('.')[0]);
  const hasMajorChange = latestMajor > currentMajor;
  
  // Get package info for changelog analysis
  const infoResult = spawnSync("npm", ["info", packageName, "--json"], { encoding: "utf-8" });
  let packageInfo = {};
  try {
    packageInfo = JSON.parse(infoResult.stdout || "{}");
  } catch {}
  
  return {
    hasMajorVersionChange: hasMajorChange,
    riskLevel: hasMajorChange ? 'high' : 'low',
    changelog: (packageInfo as any).homepage || '',
    repository: (packageInfo as any).repository?.url || '',
    hasBreakingChanges: hasMajorChange, // Simplified: major version = breaking changes
    migrationRequired: hasMajorChange
  };
};

/**
 * Check peer dependency compatibility
 * @param packageName Package to check
 * @param projectPath Project path
 * @returns Peer dependency analysis
 */
const checkPeerDependencies = (packageName: string, projectPath: string): any => {
  const infoResult = spawnSync("npm", ["info", packageName, "peerDependencies", "--json"], { 
    cwd: projectPath, 
    encoding: "utf-8" 
  });
  
  try {
    const peerDeps = JSON.parse(infoResult.stdout || "{}");
    return {
      hasPeerDependencies: Object.keys(peerDeps).length > 0,
      peerDependencies: peerDeps,
      compatibilityIssues: [] // Simplified for now
    };
  } catch {
    return {
      hasPeerDependencies: false,
      peerDependencies: {},
      compatibilityIssues: []
    };
  }
};

/**
 * Analyze breaking changes for all outdated packages
 * @param outdatedPackages Outdated packages to analyze
 * @param projectPath Project path
 * @returns Breaking change analysis
 */
const analyzeBreakingChanges = (outdatedPackages: Record<string, any>, projectPath: string): any => {
  const analysis = {
    safeUpdates: [] as string[],
    riskyUpdates: [] as string[],
    breakingChanges: {} as Record<string, any>,
    peerDependencyIssues: {} as Record<string, any>
  };
  
  for (const [packageName, details] of Object.entries(outdatedPackages)) {
    const breakingAnalysis = checkBreakingChanges(packageName, details.current, details.latest);
    const peerAnalysis = checkPeerDependencies(packageName, projectPath);
    
    analysis.breakingChanges[packageName] = breakingAnalysis;
    analysis.peerDependencyIssues[packageName] = peerAnalysis;
    
    // Categorize as safe or risky
    if (breakingAnalysis.riskLevel === 'low' && !peerAnalysis.hasPeerDependencies) {
      analysis.safeUpdates.push(packageName);
    } else {
      analysis.riskyUpdates.push(packageName);
    }
  }
  
  return analysis;
};

/**
 * Get outdated packages for reporting (read-only, no updates)
 * @param projectPath Path to project
 * @returns Record of outdated packages
 */
const getOutdatedPackagesReadOnly = (projectPath: string): Record<string, any> => {
  const result = spawnSync("npm", ["outdated", "--json"], { cwd: projectPath, encoding: "utf-8" });
  
  if (result.stdout) {
    try {
      return JSON.parse(result.stdout);
    } catch {
      return {};
    }
  }
  return {};
};

/**
 * Generate comprehensive security and dependency report
 * @param projectPath Path to project
 */
export const generateComprehensiveReport = (projectPath: string): void => {
  log("\n=== Generating Comprehensive Security & Dependency Report ===");
  
  // Gather all report data (READ-ONLY)
  const securityReport = generateSecurityReport(projectPath);
  const dependencyReport = generateDependencyReport(projectPath);
  const outdatedPackages = getOutdatedPackagesReadOnly(projectPath);
  const breakingChangeAnalysis = analyzeBreakingChanges(outdatedPackages, projectPath);
  
  // Build comprehensive report
  const report: ComprehensiveReport = {
    timestamp: new Date().toISOString(),
    project: projectPath,
    security: {
      vulnerabilities: securityReport.vulnerabilities || {},
      summary: securityReport.metadata || {},
      vulnerable_packages: Object.keys(securityReport.vulnerabilities || {})
    },
    dependencies: {
      total: Object.keys(dependencyReport.dependencies || {}).length,
      circular: findCircularDependencies(dependencyReport),
      outdated: Object.keys(outdatedPackages).length,
      outdated_list: outdatedPackages
    },
    breakingChanges: {
      safeUpdates: breakingChangeAnalysis.safeUpdates,
      riskyUpdates: breakingChangeAnalysis.riskyUpdates,
      analysis: breakingChangeAnalysis.breakingChanges,
      peerDependencyIssues: breakingChangeAnalysis.peerDependencyIssues
    },
    recommendations: []
  };
  
  // Generate recommendations
  generateRecommendations(report);
  
  // Save report to file
  const reportFile = saveReportToFile(report);
  
  // Display summary
  displayReportSummary(report, reportFile);
  
  writeLog(`Comprehensive report generated: ${reportFile}`);
};

/**
 * Generate actionable recommendations based on report data
 */
const generateRecommendations = (report: ComprehensiveReport): void => {
  if (report.security.vulnerable_packages.length > 0) {
    report.recommendations.push("Run with --security-only to update vulnerable packages");
  }
  if (report.dependencies.circular.length > 0) {
    report.recommendations.push("Review circular dependencies for potential refactoring");
  }
  if (report.dependencies.outdated > 0) {
    report.recommendations.push("Consider updating outdated packages with --minor-only for safer updates");
  }
  if (report.breakingChanges.safeUpdates.length > 0) {
    report.recommendations.push(`${report.breakingChanges.safeUpdates.length} packages can be safely updated without breaking changes`);
  }
  if (report.breakingChanges.riskyUpdates.length > 0) {
    report.recommendations.push(`${report.breakingChanges.riskyUpdates.length} packages may have breaking changes - review before updating`);
  }
};

/**
 * Save report to JSON file
 */
const saveReportToFile = (report: ComprehensiveReport): string => {
  const reportFile = path.join(getLogDir(), `security-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  return reportFile;
};

/**
 * Display formatted report summary to console
 */
const displayReportSummary = (report: ComprehensiveReport, reportFile: string): void => {
  log(`\n📊 SECURITY & DEPENDENCY REPORT`);
  log(`📁 Project: ${report.project}`);
  log(`🔒 Vulnerabilities: ${report.security.vulnerable_packages.length}`);
  log(`📦 Total Dependencies: ${report.dependencies.total}`);
  log(`🔄 Circular Dependencies: ${report.dependencies.circular.length}`);
  log(`⚠️  Outdated Packages: ${report.dependencies.outdated}`);
  
  // Breaking changes summary
  log(`\n🔍 BREAKING CHANGE ANALYSIS`);
  log(`✅ Safe Updates: ${report.breakingChanges.safeUpdates.length}`);
  log(`⚠️  Risky Updates: ${report.breakingChanges.riskyUpdates.length}`);
  
  if (report.security.vulnerable_packages.length > 0) {
    log(`\n🚨 VULNERABLE PACKAGES:`);
    report.security.vulnerable_packages.forEach((pkg: string) => log(`  - ${pkg}`));
  }
  
  if (report.dependencies.circular.length > 0) {
    log(`\n🔄 CIRCULAR DEPENDENCIES:`);
    report.dependencies.circular.forEach((cycle: string) => log(`  - ${cycle}`));
  }
  
  if (report.breakingChanges.safeUpdates.length > 0) {
    log(`\n✅ SAFE UPDATES (No Breaking Changes):`);
    report.breakingChanges.safeUpdates.forEach((pkg: string) => log(`  - ${pkg}`));
  }
  
  if (report.breakingChanges.riskyUpdates.length > 0) {
    log(`\n⚠️  RISKY UPDATES (Potential Breaking Changes):`);
    report.breakingChanges.riskyUpdates.forEach((pkg: string) => log(`  - ${pkg}`));
  }
  
  log(`\n💡 RECOMMENDATIONS:`);
  report.recommendations.forEach((rec: string) => log(`  - ${rec}`));
  
  log(`\n📄 Full report saved: ${reportFile}`);
};

/**
 * Get safe packages for priority updating
 * @param outdatedPackages Already fetched outdated packages
 * @returns Array of safe package names
 */
export const getSafePackagesForUpdate = (outdatedPackages: Record<string, any>, projectPath: string): string[] => {
  const breakingChangeAnalysis = analyzeBreakingChanges(outdatedPackages, projectPath);
  return breakingChangeAnalysis.safeUpdates;
};
