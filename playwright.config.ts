import { defineConfig } from '@playwright/test';

export default defineConfig({
    //   globalSetup: require.resolve('./{path_to_file}/global-setup'), // Uncomment if you have a global setup file
    //   globalTeardown: require.resolve('./{path_to_file}/global-teardown'), // Uncomment if you have a global teardown file
    timeout: 60000, // global timeout for every test
    expect: {
        timeout: 15000, // global timeout for expect
    },
    testDir: './src/tests',
    retries: 1, // Retry failed tests once
    use: {
        headless: true,
        baseURL: 'https://playwright.dev',
        // testIdAttribute: 'data-bdd-selector', // If you want to use a custom test ID attribute
        /* Options: 'on', 'off', 'retain-on-failure', 'on-first-retry' */
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
    },
    reporter: [['list']],
});
