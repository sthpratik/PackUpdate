import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { log } from '../utils/logger';

export class VersionService {
  /**
   * Update project version in package.json and package-lock.json
   */
  static updateProjectVersion(projectPath: string, versionType: string, quietMode: boolean = false): void {
    try {
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      if (!fs.existsSync(packageJsonPath)) {
        log('⚠️  No package.json found, skipping version update');
        return;
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const currentVersion = packageJson.version || '1.0.0';
      
      let newVersion: string;
      
      if (this.isValidSemver(versionType)) {
        // Specific version provided
        newVersion = versionType;
      } else {
        // Calculate new version based on type
        const calculatedVersion = this.calculateNewVersion(currentVersion, versionType);
        if (!calculatedVersion) {
          log(`❌ Invalid version type: ${versionType}. Use major, minor, patch, or x.y.z format`);
          return;
        }
        newVersion = calculatedVersion;
      }

      // Update package.json
      packageJson.version = newVersion;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      
      // Update package-lock.json if it exists
      const packageLockPath = path.join(projectPath, 'package-lock.json');
      if (fs.existsSync(packageLockPath)) {
        const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
        packageLock.version = newVersion;
        if (packageLock.packages && packageLock.packages[""]) {
          packageLock.packages[""].version = newVersion;
        }
        fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2) + '\n');
      }

      log(`📦 Updated project version: ${currentVersion} → ${newVersion}`);
      
    } catch (error) {
      log(`❌ Failed to update project version: ${error}`);
    }
  }

  /**
   * Check if string is valid semver format (x.y.z)
   */
  private static isValidSemver(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
  }

  /**
   * Calculate new version based on current version and type
   */
  private static calculateNewVersion(currentVersion: string, type: string): string | null {
    const parts = currentVersion.split('.').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return null;
    }

    let [major, minor, patch] = parts;

    switch (type.toLowerCase()) {
      case 'major':
        major++;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor++;
        patch = 0;
        break;
      case 'patch':
        patch++;
        break;
      default:
        return null;
    }

    return `${major}.${minor}.${patch}`;
  }
}
