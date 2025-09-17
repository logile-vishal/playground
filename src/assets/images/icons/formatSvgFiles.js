
import fs from "fs"
import path from "path"
const svgFolder = "."; // change to your folder path
const indexFile = "../../../core/constants/Icons.tsx"; // path where index file should be generated

// Helper to remove fill attributes
function removeFillAttributes(svgContent) {
  return svgContent.replace(/\s*fill=".*?"/g, ""); // removes fill="..."
}

// Helper to convert file name to camelCase key
function toCamelCase(str) {
  return str
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase()) // convert -x to X
    .replace(/\.svg$/, ""); // remove .svg
}

fs.readdir(svgFolder, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  const iconEntries = [];

  files.forEach((file) => {
    if (path.extname(file).toLowerCase() === ".svg") {
      const oldPath = path.join(svgFolder, file);

      // Normalize file name
      const newFileName = file.replace(/\s+/g, "-").toLowerCase();
      const newPath = path.join(svgFolder, newFileName);

      fs.renameSync(oldPath, newPath);

      // Remove fills
      const data = fs.readFileSync(newPath, "utf8");
      const cleanedSvg = removeFillAttributes(data);
      fs.writeFileSync(newPath, cleanedSvg, "utf8");

      // Prepare icon entry
      const key = toCamelCase(newFileName);
      iconEntries.push(
        `    ${key}: React.lazy(() => import('@/assets/images/icons/${newFileName}?react'))`
      );

      console.log(`Processed: ${newFileName}`);
    }
  });

  // Generate index file content
  const fileContent = `import React from "react";
export const icons = {
${iconEntries.join(",\n")}
};
`;

  fs.writeFileSync(indexFile, fileContent, "utf8");
  console.log(`\n✅ Index file generated at ${indexFile}`);
});
