import { defineConfig } from 'vite';

// The `public/` folder is served at the web root, so the self-hosted editor
// copied into public/tinymce is reachable at /tinymce/tinymce.min.js.
export default defineConfig({
  server: {
    port: 5174,
  },
});
