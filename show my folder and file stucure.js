const fs = require('fs');
const path = require('path');

const directoryPath = './'; // The current working directory
const ignoredDirectories = ['.idea', '.next', 'node_modules'];

function readDirRecursive(directoryPath, indent) {
    fs.readdir(directoryPath, function(err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        // Iterate through all files and folders in the directory
        files.forEach(function (file, index) {
            const filePath = path.join(directoryPath, file);

            // Check if it's a file or a folder
            fs.stat(filePath, function(err, stat) {
                if (err) {
                    return console.log('Unable to get file/folder information: ' + err);
                }

                // Add indent based on the level of recursion
                const fileIndent = indent + (index === files.length - 1 ? "└─" : "├─") + (stat.isDirectory() ? "📁 " : "📄 ");

                // Check if the file/folder should be ignored
                if (!ignoredDirectories.includes(file)) {
                    console.log(fileIndent + file);

                    // Recursively call this function to scan subfolders
                    if (stat.isDirectory()) {
                        readDirRecursive(filePath, indent + (index === files.length - 1 ? "   " : "│  "));
                    }
                }
            });
        });
    });
}

console.log("📂 " + directoryPath); // Print the root directory
readDirRecursive(directoryPath, ""); // Call the function with the initial directory path and no indentation
