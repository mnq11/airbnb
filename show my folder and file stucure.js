const fs = require("fs");
const path = require("path");

const directoryPath = "./"; // The current working directory
const ignoredDirectories = [
  ".idea",
  ".next",
  "node_modules",
  ".git",
  ".vscode",
  "public",
];
const ignoredFiles = [
  ".dockerignore",
  ".eslintrc.json",
  ".env",
  ".gitignore",
  "Airbnb.iml",
  "docker-compose.yml",
  "Dockerfile",
  "electron.js",
  "middleware.ts",
  "next-env.d.ts",
  "next.config.js",
  "package.json",
  "postcss.config.js",
  "Procfile",
  "README.md",
  "show my folder and file stucure.js",
  "tailwind.config.js",
  "tsconfig.json",
  "tsconfig.tsbuildinfo",
  "package-lock.json",
];

function readDirRecursive(directoryPath, indent) {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    // Filter out ignored files and directories
    files = files.filter(
      (file) =>
        !ignoredDirectories.includes(file) && !ignoredFiles.includes(file),
    );

    // Iterate through all files and folders in the directory
    files.forEach(function (file, index) {
      const filePath = path.join(directoryPath, file);

      // Check if it's a file or a folder
      fs.stat(filePath, function (err, stat) {
        if (err) {
          return console.log("Unable to get file/folder information: " + err);
        }

        // Add indent based on the level of recursion
        const fileIndent =
          indent +
          (index === files.length - 1 ? "└─" : "├─") +
          (stat.isDirectory() ? "📁 " : "📄 ");

        console.log(fileIndent + file);

        // Recursively call this function to scan subfolders
        if (stat.isDirectory()) {
          readDirRecursive(
            filePath,
            indent + (index === files.length - 1 ? "   " : "│  "),
          );
        }
      });
    });
  });
}

console.log("📂 " + directoryPath); // Print the root directory
readDirRecursive(directoryPath, ""); // Call the function with the initial directory path and no indentation
