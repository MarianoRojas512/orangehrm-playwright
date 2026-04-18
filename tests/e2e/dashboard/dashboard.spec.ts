import { test, expect } from '@playwright/test';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('should display all widgets', { tag: '@smoke' }, async () => {
    await expect(dashboardPage.timeAtWorkWidget).toBeVisible();
    await expect(dashboardPage.myActionsWidget).toBeVisible();
    await expect(dashboardPage.quickLaunchWidget).toBeVisible();
    await expect(dashboardPage.buzzLatestPostsWidget).toBeVisible();
    await expect(dashboardPage.employeesOnLeaveWidget).toBeVisible();
    await expect(dashboardPage.employeeDistBySubUnitWidget).toBeVisible();
    await expect(dashboardPage.employeeDistByLocationWidget).toBeVisible();
  });

  const quickLaunchCases = [
    { name: 'Assign Leave', url: /assignLeave/ },
    { name: 'Leave List', url: /viewLeaveList/ },
    { name: 'Timesheets', url: /viewEmployeeTimesheet/ },
    { name: 'Apply Leave', url: /applyLeave/ },
    { name: 'My Leave', url: /viewMyLeaveList/ },
    { name: 'My Timesheet', url: /viewMyTimesheet/ },
  ];

  for (const { name, url } of quickLaunchCases) {
    test(`should navigate to ${name} from Quick Launch`, { tag: '@smoke' }, async ({ page }) => {
      await dashboardPage.clickQuickLaunch(name);
      await expect(page).toHaveURL(url);
    });
  }

  const sidebarCases = [
    { name: 'Admin', url: /viewSystemUsers/ },
    { name: 'PIM', url: /viewEmployeeList/ },
    { name: 'Leave', url: /viewLeaveList/ },
    { name: 'Time', url: /viewEmployeeTimesheet/ },
    { name: 'Recruitment', url: /viewCandidates/ },
    { name: 'My Info', url: /viewPersonalDetails/ },
    { name: 'Performance', url: /searchEvaluatePerformanceReview/ },
    { name: 'Dashboard', url: /dashboard\/index/ },
    { name: 'Directory', url: /viewDirectory/ },
    { name: 'Maintenance', url: /purgeEmployee/ },
    { name: 'Claim', url: /viewAssignClaim/ },
    { name: 'Buzz', url: /viewBuzz/ },
  ];

  for (const { name, url } of sidebarCases) {
    test(`should navigate to ${name} from sidebar`, { tag: '@smoke' }, async ({ page }) => {
      await dashboardPage.clickSidebarLink(name);
      await expect(page).toHaveURL(url);
    });
  }
});