import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async fillDate(locator: Locator, value: string): Promise<void> {
    await locator.click({ clickCount: 3 });
    await locator.fill(value);
  }
}
