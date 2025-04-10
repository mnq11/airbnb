// This file is a placeholder and will be properly configured when you install Cypress
// To use Cypress, install it with: npm install --save-dev cypress

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  screenshotOnRunFailure: true,
  video: true,
  videoCompression: 32,
}); 