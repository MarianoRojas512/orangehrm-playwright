import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class EmployeeListPage extends BasePage {
  private static readonly PATH = '/web/index.php/pim/viewEmployeeList';

  readonly pageHeading: Locator;
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly addButton: Locator;
  readonly employeeTable: Locator;
  readonly deleteConfirmModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly noRecordsToast: Locator;
  readonly noRecordsText: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.employeeNameInput = page
      .locator('.oxd-input-group', { hasText: 'Employee Name' })
      .getByPlaceholder('Type for hints...');
    this.employeeIdInput = page
      .locator('.oxd-input-group', { hasText: 'Employee Id' })
      .getByRole('textbox');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.employeeTable = page.getByRole('table');
    this.deleteConfirmModal = page.getByRole('dialog').getByText('Are you Sure?');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.noRecordsToast = page.locator('.oxd-text--toast-message');
    this.noRecordsText = page.locator('.orangehrm-horizontal-padding');
  }

  async navigate(): Promise<void> {
    await super.navigate(EmployeeListPage.PATH);
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  getEmployeeRow(firstName: string, lastName: string): Locator {
    return this.employeeTable.getByRole('row', { name: new RegExp(`${firstName}.*${lastName}`) });
  }

  getDeleteButton(firstName: string, lastName: string): Locator {
    return this.getEmployeeRow(firstName, lastName).locator('button:has(i.bi-trash)');
  }

  async searchEmployeeByName(employee: { firstName: string; middleName: string; lastName: string }): Promise<void> {
    await this.employeeNameInput.fill(employee.firstName);
    await this.page
      .getByRole('option', { name: `${employee.firstName} ${employee.middleName} ${employee.lastName}` })
      .click();
    await this.searchButton.click();
  }

  async deleteEmployee(firstName: string, lastName: string): Promise<void> {
    await this.getDeleteButton(firstName, lastName).click();
    await this.deleteConfirmModal.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
  }
}
