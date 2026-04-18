import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import users from '@test-data/users.json';

const authFile = '.playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.navigate();
  await page.waitForLoadState('domcontentloaded');

  await loginPage.login(users.admin.username, users.admin.password);

  await expect(dashboardPage.dashboardHeading).toBeVisible();

  await page.context().storageState({ path: authFile });
});