import inquirer from 'inquirer';
import { OutdatedPackage } from '../types';

export interface PackageChoice {
  name: string;
  current: string;
  wanted: string;
  latest: string;
  updateType: 'minor' | 'major' | 'skip';
}

export class InteractiveService {
  async selectPackages(outdatedPackages: Record<string, OutdatedPackage>): Promise<PackageChoice[]> {
    const packages = Object.entries(outdatedPackages);
    
    if (packages.length === 0) {
      console.log('✅ No outdated packages found!');
      return [];
    }

    console.log('\n📦 Found outdated packages:\n');
    
    const choices = packages.map(([name, info]) => {
      const hasMinor = info.current !== info.wanted;
      const hasMajor = info.wanted !== info.latest;
      
      let description = `${name}: ${info.current}`;
      if (hasMinor) description += ` → ${info.wanted} (minor)`;
      if (hasMajor) description += ` → ${info.latest} (major)`;
      
      return {
        name: description,
        value: { name, ...info }
      };
    });

    const { selectedPackages } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedPackages',
        message: 'Select packages to update:',
        choices,
        pageSize: 15
      }
    ]);

    if (selectedPackages.length === 0) {
      console.log('No packages selected for update.');
      return [];
    }

    const packageChoices: PackageChoice[] = [];

    for (const pkg of selectedPackages) {
      const hasMinor = pkg.current !== pkg.wanted;
      const hasMajor = pkg.wanted !== pkg.latest;
      
      let updateOptions = [];
      if (hasMinor) updateOptions.push({ name: `Minor: ${pkg.current} → ${pkg.wanted}`, value: 'minor' });
      if (hasMajor) updateOptions.push({ name: `Major: ${pkg.current} → ${pkg.latest}`, value: 'major' });
      updateOptions.push({ name: 'Skip this package', value: 'skip' });

      if (updateOptions.length === 1) {
        // Only skip option, shouldn't happen but handle it
        packageChoices.push({
          name: pkg.name,
          current: pkg.current,
          wanted: pkg.wanted,
          latest: pkg.latest,
          updateType: 'skip'
        });
        continue;
      }

      const { updateType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'updateType',
          message: `How do you want to update ${pkg.name}?`,
          choices: updateOptions
        }
      ]);

      packageChoices.push({
        name: pkg.name,
        current: pkg.current,
        wanted: pkg.wanted,
        latest: pkg.latest,
        updateType
      });
    }

    return packageChoices.filter(choice => choice.updateType !== 'skip');
  }

  async confirmUpdates(choices: PackageChoice[]): Promise<boolean> {
    if (choices.length === 0) return false;

    console.log('\n📋 Update Summary:');
    choices.forEach(choice => {
      const targetVersion = choice.updateType === 'major' ? choice.latest : choice.wanted;
      console.log(`  ${choice.name}: ${choice.current} → ${targetVersion} (${choice.updateType})`);
    });

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with these updates?',
        default: true
      }
    ]);

    return confirm;
  }
}
