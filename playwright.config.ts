import { defineConfig, devices } from '@playwright/test'
const CI = process.env.CI ?? false

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : 2,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
})
