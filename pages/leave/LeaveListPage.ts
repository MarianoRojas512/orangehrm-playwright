import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LeaveListPage extends BasePage {
  private static readonly PATH = '/web/index.php/leave/viewLeaveList';

  readonly pageHeading: Locator;
  readonly employeeNameInput: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly leaveStatusDropdown: Locator;
  readonly searchButton: Locator;
  readonly leaveTable: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Leave List' });
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.leaveTypeDropdown = page
      .locator('.oxd-input-group', { hasText: 'Leave Type' })
      .locator('.oxd-select-text');
    this.fromDateInput = page.locator('.oxd-date-input input').first();
    this.toDateInput = page.locator('.oxd-date-input input').nth(1);
    this.leaveStatusDropdown = page
      .locator('.oxd-input-group', { hasText: 'Show Leave with Status' })
      .locator('.oxd-select-text');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.leaveTable = page.getByRole('table');
  }

  async navigate(): Promise<void> {
    await super.navigate(LeaveListPage.PATH);
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  getLeaveRow(employeeName: string): Locator {
    return this.leaveTable.getByRole('row', { name: new RegExp(employeeName) });
  }
}
