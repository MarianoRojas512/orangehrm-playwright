import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class VacanciesPage extends BasePage {
  private static readonly PATH = '/web/index.php/recruitment/viewJobVacancy';

  readonly pageHeading: Locator;
  readonly searchButton: Locator;
  readonly addButton: Locator;
  readonly jobTitleSelect: Locator;
  readonly table: Locator;
  readonly deleteSelectedButton: Locator;
  readonly noRecordsText: Locator;
  readonly noRecordsToast: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.jobTitleSelect = page
      .locator('.oxd-input-group', { hasText: 'Job Title' })
      .locator('.oxd-select-text');
    this.table = page.getByRole('table');
    this.deleteSelectedButton = page.getByRole('button', { name: 'Delete Selected' });
    this.noRecordsText = page.locator('.orangehrm-horizontal-padding');
    this.noRecordsToast = page.locator('.oxd-text--toast-message');
  }

  async navigate(): Promise<void> {
    await super.navigate(VacanciesPage.PATH);
    await this.addButton.waitFor({ state: 'visible' });
  }

  getVacancyRow(vacancyName: string): Locator {
    return this.table.getByRole('row', { name: new RegExp(vacancyName) });
  }

  async selectVacancyCheckbox(vacancyName: string): Promise<void> {
    await this.getVacancyRow(vacancyName).locator('.oxd-checkbox-input').click();
  }

  async deleteSelected(): Promise<void> {
    await this.deleteSelectedButton.click();
    await this.page.getByRole('dialog').getByText('Are you Sure?').waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
  }
}
