const fs = require("fs");
const path = require("path");

function createIndexFile(
  startDir,
  skipDirs = [],
  includeExtensions = [".ts", ".tsx"],
  excludeExtensions = [".d.ts"]
) {
  const fileNames = fs.readdirSync(startDir);

  const files = fileNames.filter((fileName) => {
    const filePath = path.join(startDir, fileName);
    const isFile = fs.statSync(filePath).isFile();
    const hasAllowedExtension = includeExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    const hasDisallowedExtension = excludeExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    const isIndexFile = fileName === "index.ts";
    return (
      isFile && hasAllowedExtension && !hasDisallowedExtension && !isIndexFile
    );
  });

  const directories = fileNames.filter((fileName) => {
    const filePath = path.join(startDir, fileName);
    return fs.statSync(filePath).isDirectory() && !skipDirs.includes(fileName);
  });

  const currentDir = path.basename(startDir);
  const indexPath = path.join(startDir, "index.ts");
  const content = [
    ...files.map((fileName) => {
      const baseName = path.basename(fileName, path.extname(fileName));
      return `export * from './${baseName}'`;
    }),
    ...directories.map((dirName) => {
      const dirPath = path.join(startDir, dirName);
      const hasAllowedFile = fs.readdirSync(dirPath).some((fileName) => {
        const filePath = path.join(dirPath, fileName);
        const isFile = fs.statSync(filePath).isFile();
        const hasAllowedExtension = includeExtensions.some((ext) =>
          fileName.endsWith(ext)
        );
        const hasDisallowedExtension = excludeExtensions.some((ext) =>
          fileName.endsWith(ext)
        );
        return isFile && hasAllowedExtension && !hasDisallowedExtension;
      });
      if (hasAllowedFile) {
        return `export * from './${dirName}'`;
      }
    }),
  ]
    .filter(Boolean)
    .join("\n");

  if (content.length) {
    fs.writeFileSync(indexPath, content);
  }

  directories.forEach((dirName) => {
    const dirPath = path.join(startDir, dirName);
    createIndexFile(dirPath, skipDirs, includeExtensions, excludeExtensions);
  });
}

// Usage: call createIndexFile with the starting directory path, an array of directories to skip, and an array of extensions to include
createIndexFile(
  __dirname,
  ["assets", "stories", ""],
  [".ts", ".tsx"],
  [".d.ts"]
);
