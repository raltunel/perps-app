// scripts/write-version.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to package.json
const packageJsonPath = path.join(__dirname, '../package.json');

// Read and parse package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Use the version property from package.json
const version = {
    version: packageJson.version,
};

// Write to the public directory so it gets copied to the build output
const outDir = path.join(__dirname, '../public');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(
    path.join(outDir, 'version.json'),
    JSON.stringify(version, null, 2),
);
