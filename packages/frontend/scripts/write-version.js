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

const outDir = path.join(__dirname, '../packages/frontend/build/client');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify(version));
