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
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: 'npm run dev',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
