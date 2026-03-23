import { Page } from '@playwright/test';

export class HomePage {
  constructor(public readonly page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async clickWelcomeBanner() {
    await this.page.getByTestId('welcome-banner').click();
  }

  getHeader() {
    return this.page.getByRole('heading', { level: 1 });
  }
}
