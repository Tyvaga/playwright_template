## Getting Started
This document will help you set up Playwright, run example tests, and understand the project structure.

## Clone the project
```bash
git clone git@github.com:Tyvaga/playwright_template.git
cd playwright_template
```
## Prerequisites
- Node.js (LTS version) + npm  
  Download: [https://nodejs.org/](https://nodejs.org/)
- TypeScript dependencies
  Run in project folder:
```bash
npm install -D typescript
npm install -D @types/node
```
## Install Playwright
Run the following commands in your project folder:
```bash
npm install -D @playwright/test   # Installs Playwright Test locally as a dev dependency
npx playwright install            # Installs supported browsers
```
## Running Tests
To run the test run this command in your project folder:
```bash
npx playwright test
```
Example Output:
  ✓  user can visit the home page and see the header

  1 passed
Note: Your output will include all tests in the tests folder. Each test shows a ✓ for pass or ✗ for fail.

## Folder Structure
```
src/
└── app/
    ├── pages/          # UI surfaces (atomic actions)
    ├── services/       # UI logic (waits, branching, multi-step operations)
    ├── workflows/      # Behaviour orchestration
    ├── assertions/     # Reusable validation logic
    └── util/           # Optional helpers
    fixtures/
    └── baseFixture.ts      # Dependency injection + registry wiring
    tests/
    └── *.spec.ts           # Narrative-driven tests
```

## Overview
```
Test
 ├──→ Workflow ───→ Page
 ├──→ Service  ───→ Page
 ├──→ Assertions → Page
 └──→ Page            
```

## Pages - UI Surface Layer
Pages represent the raw UI of the application.

They contain:

- Element locators
- Atomic UI actions (click, type, open, hover)
- No business logic
- No branching
- No waits (except minimal UI‑state waits if absolutely required)

Example:
```
export class HomePage {
  constructor(public readonly page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.page.getByRole("link", { name: "Get started" }).click();
  }

  getHeader() {
    return this.page.getByRole('heading', { level: 1 });
  }
}
```
Pages are intentionally simple — they expose capabilities, not behaviour.

## Services — UI Logic Layer
Services sit one level above pages.
They combine multiple UI steps into a single intention‑driven action.

They contain:

- Wait logic
- Branching
- Multi‑step UI operations
- Domain‑to‑UI mapping
- Reusable UI logic

Example:
```
export class NavigationService {
  constructor(
    public readonly page: Page,
    private readonly homePage: HomePage
  ) {}

  async goToHome() {
    await this.homePage.open();
    await this.waitForLoader();
  }

  async clickButtonAndWait() {
    await this.homePage.clickGetStarted();
    await this.waitForLoader();
  }

  private async waitForLoader() {
    const loader = this.page.getByTestId('loading-indicator');
    await loader.waitFor({ state: 'hidden', timeout: 5000 });
  }
}
```
Services ensure workflows or tests remain clean and expressive.

## Workflows — Behaviour Layer

Workflows orchestrate multi‑step behaviour across pages and services.

They express intent, not UI mechanics.

Example:
```
export class HomeWorkflow {
  constructor(private readonly navigation: NavigationService) {}

  async visitHome() {
    await this.navigation.goToHome();
    await this.navigation.clickButtonAndWait();
  }
}
```
Workflows keep tests readable and narrative‑driven.

## Assertions — Validation Layer

Assertions contain reusable validation logic.

Use assertion classes when:
- A validation involves multiple steps
- A validation is domain‑specific
- A validation is reused across multiple tests

Example:
```
export class HomeAssertion {
  constructor(private readonly homePage: HomePage) {}

  async headerIsVisible() {
    await expect(this.homePage.getHeader()).toBeVisible();
  }
}
```

For simple, one-line checks needed only in a single test, you can call expect directly in the test without creating a separate assertion method.

## Dependency Injection via Base Fixture

The baseFixture.ts file is the central wiring layer of the framework.

It:
- Registers all Pages, Services, Workflows, Assertions
- Injects dependencies automatically
- Ensures tests only request what they need
- Keeps setup consistent across the suite

## Registry‑Driven Architecture
```
const pageRegistry = {
  homePage: HomePage,
};

const serviceRegistry = {
  navigationService: NavigationService,
};

const workflowRegistry = {
  homeWorkflow: HomeWorkflow,
};

const assertionRegistry = {
  homeAssertion: HomeAssertion,
};
```

## Declare Types
```
type MyFixtures = {
  // Pages
  [K in keyof typeof pageRegistry]: InstanceType<(typeof pageRegistry)[K]>;
} & {
  // Services
  [K in keyof typeof serviceRegistry]: InstanceType<
    (typeof serviceRegistry)[K]
  >;
} & {
  // Workflows
  [K in keyof typeof workflowRegistry]: InstanceType<
    (typeof workflowRegistry)[K]
  >;
} & {
  // Assertions
  [K in keyof typeof assertionRegistry]: InstanceType<
    (typeof assertionRegistry)[K]
  >;
}
```

## Automatic Page Registration

Pages are auto‑constructed using a generic mapping:
```
  ...Object.fromEntries(
    Object.entries(pageRegistry).map(([name, PageClass]) => [
      name,
      async ({ page }: { page: Page }, use: (fixture: InstanceType<typeof PageClass>) => Promise<void>) => {
        await use(new PageClass(page));
      },
      { scope: "test" },
    ]),
  ),
```

## Manual Wiring for Services, Workflows, Assertions

These require explicit Dependency Injection:
```
navigationService: async ({ page, homePage }, use) => {
  await use(new NavigationService(page, homePage));
},

homeWorkflow: async ({ navigationService }, use) => {
  await use(new HomeWorkflow(navigationService));
},

homeAssertion: async ({ homePage }, use) => {
  await use(new HomeAssertion(homePage));
},
```
Example Test:
```
test('user can visit the home page and see the header', async ({
  homeWorkflow,
  homeAssertion
}) => {
  await homeWorkflow.visitHome();
  await homeAssertion.headerIsVisible();
});
```
This test contains:
- No selectors
- No waits
- No UI logic

Just behaviour.

## How to Add New Components

## Add a Page
- Create a file in pages/
- Add atomic UI actions
- Register it in pageRegistry

## Add a Service
- Inject the page(s) it needs
- Add UI logic
- Register it in serviceRegistry

## Add a Workflow
- Inject page(s) or service(s) it needs
- Express behaviour
- Register it in workflowRegistry

## Add an Assertion
- Inject page or service
- Add validation logic
- Register it in assertionRegistry

## Optional Utilities
The template includes commented examples for:
- localEntityTracker
- apiManager
- cleanupEntities

These are useful for:
- API‑driven setup
- Entity lifecycle management
- Automatic cleanup

They remain commented to keep the template runnable and generic.