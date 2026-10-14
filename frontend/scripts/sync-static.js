const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../out');
const staticDir = path.resolve(__dirname, '../../src/main/resources/static');

if (!fs.existsSync(outDir)) {
  console.error('Error: out directory does not exist. Run "next build" first.');
  process.exit(1);
}

console.log(`Syncing compiled Next.js build from ${outDir} to ${staticDir}...`);

// Recursive copy directory
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((element) => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

copyFolderSync(outDir, staticDir);

// Also copy index.html to list.html for Spring Boot backward compatibility
const indexHtml = path.join(staticDir, 'index.html');
const listHtml = path.join(staticDir, 'list.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, listHtml);
}

// Ensure login.html is at static/login.html if generated at login/index.html
const loginNested = path.join(staticDir, 'login/index.html');
const loginFlat = path.join(staticDir, 'login.html');
if (fs.existsSync(loginNested)) {
  fs.copyFileSync(loginNested, loginFlat);
}

console.log('Frontend build successfully synced to src/main/resources/static!');
