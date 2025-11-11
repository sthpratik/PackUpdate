/**
 * Type definitions for PackUpdate
 */

export interface OutdatedPackage {
  current: string;
  wanted: string;
  latest: string;
}

export interface UpdateResult {
  updated: [string, string, string][]; // [packageName, oldVersion, newVersion]
  failed: string[];
}

export interface SecurityReport {
  vulnerabilities?: Record<string, any>;
  metadata?: any;
}

export interface DependencyReport {
  dependencies?: Record<string, any>;
}

export interface BreakingChangeAnalysis {
  safeUpdates: string[];
  riskyUpdates: string[];
  analysis: Record<string, any>;
  peerDependencyIssues: Record<string, any>;
}

export interface ComprehensiveReport {
  timestamp: string;
  project: string;
  security: {
    vulnerabilities: Record<string, any>;
    summary: any;
    vulnerable_packages: string[];
  };
  dependencies: {
    total: number;
    circular: string[];
    outdated: number;
    outdated_list: Record<string, OutdatedPackage>;
  };
  breakingChanges: BreakingChangeAnalysis;
  recommendations: string[];
}

export interface CliArgs {
  projectPath: string;
  safeMode: boolean;
  minorOnly: boolean;
  generateReport: boolean;
  removeUnused: boolean;
  dedupePackages: boolean;
  quietMode: boolean;
  passes: number;
}
