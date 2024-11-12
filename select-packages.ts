#!/usr/bin/env bun

import inquirer from 'inquirer';
import fs from 'fs';

const packages = [
  { name: '@offs/core', path: 'packages/core' },
  { name: '@offs/vue', path: 'packages/vue' },
  { name: '@offs/arco', path: 'packages/arco' },

];

async function selectPackages() {
  // @ts-ignore
  const { selectedPackages } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedPackages',
      message: 'Select packages to publish:',
      choices: packages.map((pkg) => ({ name: pkg.name, value: pkg.path })),
    },
  ]);

  if (selectedPackages.length === 0) {
    console.log('No packages selected. Exiting...');
    process.exit(0);
  }

  fs.writeFileSync('selected-packages.txt', selectedPackages.join('\n'));
}

selectPackages();
