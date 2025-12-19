import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

// Clean Netlify functions directory (no longer needed for SPA)
await fsp
    .rm('.netlify/functions-internal', { recursive: true, force: true })
    .catch(() => {});

// Create necessary SPA structure
await fsp.mkdir('build/client', { recursive: true });

// Copy client build artifacts to Netlify publish directory
await fsp.cp('build/client', 'build', {
    recursive: true,
    filter: (src) => !src.includes('server'), // Exclude any residual server files
});

// Create _redirects file for SPA routing
const redirectsContent = [
    '/api/hubspot /.netlify/functions/hubspot 200',
    '/* /index.html 200',
].join('\n');
await fsp.writeFile(path.join('build', '_redirects'), redirectsContent);
