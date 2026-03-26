import { Page } from "@playwright/test";

export class HomePage {
  constructor(public readonly page: Page) {}

  async open() {
    await this.page.goto("/");
  }

  async clickGetStarted() {
    await this.page.getByRole("link", { name: "Get started" }).click();
  }

  getHeader() {
    return this.page.getByRole("heading", { level: 1 }); // Page title is an h1 element, so we can use getByRole to find it.
  }
}
