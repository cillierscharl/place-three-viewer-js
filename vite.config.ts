import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the build works from any sub-path (e.g. GitHub Pages).
  base: './',
  build: {
    // three.js alone is ~540 kB minified (~135 kB gzipped); there's nothing to split off.
    chunkSizeWarningLimit: 700,
  },
});
