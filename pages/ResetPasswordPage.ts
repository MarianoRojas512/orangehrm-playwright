import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ResetPasswordPage extends BasePage {
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly resetPasswordButton: Locator;
  readonly cancelButton: Locator;
  readonly usernameRequiredMessage: Locator;
  readonly resetLinkSentHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Reset Password', level: 6 });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.usernameRequiredMessage = page.getByText('Required');
    this.resetLinkSentHeading = page.getByRole('heading', { name: 'Reset Password link sent successfully', level: 6 });
  }
}