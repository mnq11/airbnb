const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function printDirectoryStructure(folder, prefix = '') {
  const files = fs.readdirSync(folder);
  files.forEach((file, index) => {
    if (
      file === '.idea' ||
      file === 'node_modules' ||
      file === 'shwo projects stucure.js' ||
      file === '.next' ||
      file === '.git'
    ) {
      // Ignore the file or directory
      return;
    }
    const filepath = path.join(folder, file);
    const stats = fs.statSync(filepath);
    const isLast = index === files.length - 1;
    const nestedPrefix = prefix + (isLast ? '└── ' : '├── ');
    if (stats.isDirectory()) {
      console.log(`${prefix}${chalk.blue(file)}/`);
      printDirectoryStructure(filepath, `${nestedPrefix}`);
    } else {
      console.log(`${prefix}${chalk.gray(file)}`);
    }
  });
}

const folder = process.argv[2] || process.cwd();
console.log(chalk.blue(folder));
printDirectoryStructure(folder);
