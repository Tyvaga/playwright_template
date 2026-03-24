import { Page } from "@playwright/test";
import { HomePage } from "../pages/homePage";

export class NavigationService {
  constructor(
    public readonly page: Page,
    private readonly homePage: HomePage,
  ) {}

  async goToHome() {
    await this.homePage.open();
    await this.waitForLoader();
  }

  async clickBannerAndWait() {
    await this.homePage.clickWelcomeBanner();
    await this.waitForLoader();
  }

  private async waitForLoader() {
    const loader = this.page.getByTestId("loading-indicator");
    await loader.waitFor({ state: "hidden", timeout: 5000 });
  }
}
