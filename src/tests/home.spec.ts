import { test, expect } from "../fixtures/baseFixture";

test("user can visit the home page and see the header", async ({
  homePage,
  homeWorkflow,
  homeAssertion,
}) => {
  await homeWorkflow.visitHome();
  await homeAssertion.headerIsVisible();
  // await expect(homePage.getHeader()).toBeVisible(); // If only one test needs this assertion, it can be done directly in the test without a separate assertion class.
});
