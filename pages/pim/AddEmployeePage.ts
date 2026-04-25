import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { generateEmployeeData } from '@utils/testData';

export class AddEmployeePage extends BasePage {
  private static readonly PATH = '/web/index.php/pim/addEmployee';

  readonly pageHeading: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Add Employee' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page
      .locator('.oxd-input-group', { hasText: 'Employee Id' })
      .getByRole('textbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.validationErrors = page.locator('.oxd-input-field-error-message');
  }

  async navigate(): Promise<void> {
    await super.navigate(AddEmployeePage.PATH);
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  async addEmployee() {
    const data = generateEmployeeData();
    await expect(this.employeeIdInput).not.toHaveValue('');
    await this.firstNameInput.fill(data.firstName);
    await this.middleNameInput.fill(data.middleName);
    await this.lastNameInput.fill(data.lastName);
    await this.saveButton.click();
    await this.page.waitForURL(/empNumber\/(\d+)/);
    const match = this.page.url().match(/empNumber\/(\d+)/);
    const empNumber = match ? parseInt(match[1]) : null;
    return { ...data, empNumber };
  }
}
