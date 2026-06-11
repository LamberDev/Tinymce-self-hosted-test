import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// The `public/` folder is served at the web root, so the self-hosted editor
// copied into public/tinymce is reachable at /tinymce/tinymce.min.js.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
  },
});
