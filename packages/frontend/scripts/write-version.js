// scripts/write-version.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const version = {
    version: new Date().toISOString(),
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write to the public directory so it gets copied to the build output
const outDir = path.join(__dirname, '../public');

console.log(`Output directory: ${outDir}`);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify(version));
