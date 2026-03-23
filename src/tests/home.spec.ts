import { test } from '../fixtures/baseFixture';

test('user can visit the home page and see the header', async ({
  homeWorkflow,
  homeAssertion
}) => {
  await homeWorkflow.visitHome();
  await homeAssertion.headerIsVisible();
});
