import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
    build: {
        rollupOptions: isSsrBuild
            ? {
                  input: './server/app.ts',
              }
            : undefined,
    },

    plugins: [
        reactRouter(),
        tsconfigPaths(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                maximumFileSizeToCacheInBytes: 3000000,
            },
            manifest: false,
        }),
    ],
}));
