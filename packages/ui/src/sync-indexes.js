const fs = require("fs");
const path = require("path");

function createIndexFile(
  startDir,
  skipDirs = [],
  extensions = [".ts", ".tsx"]
) {
  const fileNames = fs.readdirSync(startDir);

  const files = fileNames.filter((fileName) => {
    const filePath = path.join(startDir, fileName);
    const isFile = fs.statSync(filePath).isFile();
    const hasAllowedExtension = extensions.some((ext) =>
      fileName.endsWith(ext)
    );
    return isFile && hasAllowedExtension;
  });

  const directories = fileNames.filter((fileName) => {
    const filePath = path.join(startDir, fileName);
    return fs.statSync(filePath).isDirectory() && !skipDirs.includes(fileName);
  });

  const currentDir = path.basename(startDir);
  const indexPath = path.join(startDir, "index.ts");
  const content = files
    .map((fileName) => {
      const baseName = path.basename(fileName, path.extname(fileName));
      return `export * from './${baseName}'`;
    })
    .join("\n");

  fs.writeFileSync(indexPath, content);

  directories.forEach((dirName) => {
    const dirPath = path.join(startDir, dirName);
    createIndexFile(dirPath, skipDirs, extensions);
  });
}

createIndexFile(__dirname);
// Usage: call createIndexFile with the starting directory path
