import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly invalidCredentialsAlert: Locator;
  readonly usernameRequiredMessage: Locator;
  readonly passwordRequiredMessage: Locator;

  private static readonly PATH = '/web/index.php/auth/login';

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.invalidCredentialsAlert = page.getByRole('alert').getByText('Invalid credentials');
    this.usernameRequiredMessage = page.getByText('Required').first() ;
    this.passwordRequiredMessage = page.getByText('Required').nth(1);
  }

  async navigate(): Promise<void> {
    await super.navigate(LoginPage.PATH);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}