import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private static readonly PATH = '/web/index.php/dashboard/index';

  readonly dashboardHeading: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly quickLaunchWidget: Locator;
  readonly buzzLatestPostsWidget: Locator;
  readonly employeesOnLeaveWidget: Locator;
  readonly employeeDistBySubUnitWidget: Locator;
  readonly employeeDistByLocationWidget: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard', level: 6 });
    this.timeAtWorkWidget = page.getByText('Time at Work', { exact: true });
    this.myActionsWidget = page.getByText('My Actions', { exact: true });
    this.quickLaunchWidget = page.getByText('Quick Launch', { exact: true });
    this.buzzLatestPostsWidget = page.getByText('Buzz Latest Posts', { exact: true });
    this.employeesOnLeaveWidget = page.getByText('Employees on Leave Today', { exact: true });
    this.employeeDistBySubUnitWidget = page.getByText('Employee Distribution by Sub Unit', { exact: true });
    this.employeeDistByLocationWidget = page.getByText('Employee Distribution by Location', { exact: true });
  }

  async navigate(): Promise<void> {
    await super.navigate(DashboardPage.PATH);
  }

  async clickQuickLaunch(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).click();
  }

  async clickSidebarLink(name: string): Promise<void> {
    await this.page.getByRole('navigation', { name: 'Sidepanel' }).getByRole('link', { name }).click();
  }
}