import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class AssignLeavePage extends BasePage {
  private static readonly PATH = '/web/index.php/leave/assignLeave';

  readonly pageHeading: Locator;
  readonly employeeNameInput: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly partialDaysDropdown: Locator;
  readonly durationDropdown: Locator;
  readonly commentTextarea: Locator;
  readonly assignButton: Locator;
  readonly confirmModal: Locator;
  readonly confirmOkButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Assign Leave' });
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.leaveTypeDropdown = page
      .locator('.oxd-input-group', { hasText: 'Leave Type' })
      .locator('.oxd-select-text');
    this.fromDateInput = page.locator('.oxd-date-input input').first();
    this.toDateInput = page.locator('.oxd-date-input input').nth(1);
    this.partialDaysDropdown = page
      .locator('.oxd-input-group', { hasText: 'Partial Days' })
      .locator('.oxd-select-text');
    this.durationDropdown = page
      .locator('.oxd-input-group', { hasText: 'Duration' })
      .locator('.oxd-select-text');
    this.commentTextarea = page
      .locator('.oxd-input-group', { hasText: 'Comments' })
      .locator('textarea');
    this.assignButton = page.getByRole('button', { name: 'Assign' });
    this.confirmModal = page.getByText('Confirm Leave Assignment', { exact: true });
    this.confirmOkButton = page.getByRole('button', { name: 'Ok' });
  }

  async navigate(): Promise<void> {
    await super.navigate(AssignLeavePage.PATH);
    await this.pageHeading.waitFor({ state: 'visible' });
  }
}
