import { defineConfig } from '@playwright/test';

const PORT = 5173;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  reporter: [['list']],
  outputDir: './test-results',
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
    viewport: { width: 1280, height: 900 },
    // Optional escape hatch for environments where the Playwright CDN is blocked
    // and a system Chromium must be used instead: set PW_CHROMIUM_PATH.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  // Vite's `predev` hook re-copies the self-hosted TinyMCE before serving,
  // so the e2e run always exercises the real self-hosted setup.
  webServer: {
    command: 'npm run dev',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
