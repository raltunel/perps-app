// scripts/write-version.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const version = {
    version: new Date().toISOString(),
};

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Writing version information to version.json...');
console.log(`Version: ${version.version}`);
console.log(`Output directory: ${__filename}`);
console.log(`Output directory: ${__dirname}`);

const outDir = path.join(__dirname, '../packages/frontend/build/client');

console.log(`Output directory: ${outDir}`);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify(version));
