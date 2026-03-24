import { expect } from "../fixtures/baseFixture";
import { HomePage } from "../pages/homePage";

export class HomeAssertion {
  constructor(private readonly homePage: HomePage) {}

  async headerIsVisible() {
    await expect(this.homePage.getHeader()).toBeVisible();
  }
}
