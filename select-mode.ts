#!/usr/bin/env bun

import inquirer from 'inquirer';
import fs from 'fs';

const options = [
  { name: 'dev', path: 'dev' },
  { name: 'dist', path: 'dist' },
];

async function selectValues() {
  // @ts-ignore
  const { selectMode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectMode',
      message: '选择安装模式:',
      choices: options.map((pkg) => ({ name: pkg.name, value: pkg.path })),
    },
  ]);



  fs.writeFileSync('selected-mode.txt', selectMode.join('\n'));
}

selectValues();
