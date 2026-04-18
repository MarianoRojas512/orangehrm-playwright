import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ResetPasswordPage } from '@pages/ResetPasswordPage';
import users from '@test-data/users.json';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await loginPage.login(users.admin.username, users.admin.password);

    await expect(dashboardPage.dashboardHeading).toBeVisible();
  });

  test('should show required messages when submitting empty fields', async () => {
    await loginPage.loginButton.click();

    await expect(loginPage.usernameRequiredMessage).toBeVisible();
    await expect(loginPage.passwordRequiredMessage).toBeVisible();
  });

  test('should show invalid credentials alert with wrong password', async () => {
    await loginPage.login(users.admin.username, 'wrongpassword');

    await expect(loginPage.invalidCredentialsAlert).toBeVisible();
  });

  test('should show invalid credentials alert with wrong username', async () => {
    await loginPage.login('wronguser', users.admin.password);

    await expect(loginPage.invalidCredentialsAlert).toBeVisible();
  });

  test('should navigate to Reset Password page', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);

    await loginPage.forgotPasswordLink.click();

    await expect(resetPasswordPage.heading).toBeVisible();
  });

  test('should show required message when submitting empty username on reset page', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);

    await loginPage.forgotPasswordLink.click();
    await resetPasswordPage.resetPasswordButton.click();

    await expect(resetPasswordPage.usernameRequiredMessage).toBeVisible();
  });

  test('should redirect after submitting valid username on reset page', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);

    await loginPage.forgotPasswordLink.click();
    await resetPasswordPage.usernameInput.fill('randomuser123');
    await resetPasswordPage.resetPasswordButton.click();

    await expect(resetPasswordPage.resetLinkSentHeading).toBeVisible();
  });

  test('should return to login page when clicking Cancel on reset page', async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);

    await loginPage.forgotPasswordLink.click();
    await resetPasswordPage.cancelButton.click();

    await expect(page).toHaveURL(/auth\/login/);
  });
});
