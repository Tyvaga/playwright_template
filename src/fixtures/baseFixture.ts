import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { NavigationService } from '../services/navigationService';
import { HomeWorkflow } from '../workflows/homeWorkflow';
import { HomeAssertion } from '../assertions/homeAssertion';

/**
 * Registries
 * ----------
 * These registries define the classes that will be auto‑constructed
 * and injected into the test context.
 *
 * Add new pages/services/workflows/assertions here as your project grows.
 */
const pageRegistry = {
    homePage: HomePage,
    // loginPage: LoginPage,
};

const serviceRegistry = {
    navigationService: NavigationService,
    // authService: AuthService,
};

const workflowRegistry = {
    homeWorkflow: HomeWorkflow,
    // loginWorkflow: LoginWorkflow,
};

const assertionRegistry = {
    homeAssertion: HomeAssertion,
    // loginAssertion: LoginAssertion,
};

/**
 * Fixture Type
 * ------------
 * Automatically maps registry keys to their instance types.
 * This keeps the fixture strongly typed and scalable.
 */
type MyFixtures = {
    // Pages
    [K in keyof typeof pageRegistry]: InstanceType<(typeof pageRegistry)[K]>;
} & {
    // Services
    [K in keyof typeof serviceRegistry]: InstanceType<(typeof serviceRegistry)[K]>;
} & {
    // Workflows
    [K in keyof typeof workflowRegistry]: InstanceType<(typeof workflowRegistry)[K]>;
} & {
    // Assertions
    [K in keyof typeof assertionRegistry]: InstanceType<(typeof assertionRegistry)[K]>;
} & {
    /**
     * Optional utilities (commented out for template)
     * ------------------------------------------------
     * Uncomment and implement if your project needs:
     * - entity tracking
     * - API managers
     * - cleanup hooks
     */
    // localEntityTracker: Map<string, any>;
    // cleanupEntities: (fn: () => Promise<void>) => void;
    // apiManager: ApiManager;
};

/**
 * Base Fixture
 * ------------
 * Dynamically constructs all pages, services, workflows, and assertions
 * using the registries above.
 */
const test = base.extend<MyFixtures>({
    /**
     * Pages
     * -----
     * Auto‑generated from the page registry.
     * Each page receives the Playwright `page` instance.
     */
    ...Object.fromEntries(
        Object.entries(pageRegistry).map(([name, PageClass]) => [
            name,
            async ({ page }, use) => {
                await use(new PageClass(page));
            },
            { scope: 'test' },
        ]),
    ),

    /**
     * Services
     * --------
     * Services receive pages (and sometimes other services).
     * This is where dependency injection happens.
     */
    navigationService: async ({ homePage }, use) => {
        await use(new NavigationService(homePage));
    },

    // Example placeholder:
    // authService: async ({ page, loginPage }, use) => {
    //   await use(new AuthService(page, loginPage));
    // },

    /**
     * Workflows
     * ---------
     * Workflows orchestrate behaviour using services.
     */
    homeWorkflow: async ({ navigationService }, use) => {
        await use(new HomeWorkflow(navigationService));
    },

    // Example placeholder:
    // loginWorkflow: async ({ authService, navigationService }, use) => {
    //   await use(new LoginWorkflow(authService, navigationService));
    // },

    /**
     * Assertions
     * ----------
     * Assertions validate outcomes using pages or services.
     */
    homeAssertion: async ({ homePage }, use) => {
        await use(new HomeAssertion(homePage));
    },

    // Example placeholder:
    // loginAssertion: async ({ loginPage }, use) => {
    //   await use(new LoginAssertion(loginPage));
    // },

    // --- Optional utilities ---
    /*
    localEntityTracker: async ({}, use) => {
      const tracker = new Map();
      await use(tracker);
      tracker.clear();
    },
  
    apiManager: async ({}, use, testInfo) => {
      const manager = await initializeApiManager(testInfo);
      await use(manager);
    },
  
    cleanupEntities: async ({ localEntityTracker, apiManager }, use) => {
      await use(async () => {});
      await cleanupTrackedEntities(apiManager, localEntityTracker);
    },
    */
});

export { test, expect };
// export type LocalEntityTracker = Map<string, { id: number; type: EntityType }>;