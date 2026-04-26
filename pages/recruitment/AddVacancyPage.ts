import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { generateVacancyData } from '@utils/testData';

export class AddVacancyPage extends BasePage {
  private static readonly PATH = '/web/index.php/recruitment/addJobVacancy';

  readonly pageHeading: Locator;
  readonly vacancyNameInput: Locator;
  readonly jobTitleSelect: Locator;
  readonly hiringManagerInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Add Vacancy' });
    this.vacancyNameInput = page
      .locator('.oxd-input-group', { hasText: 'Vacancy Name' })
      .getByRole('textbox');
    this.jobTitleSelect = page
      .locator('.oxd-input-group', { hasText: 'Job Title' })
      .locator('.oxd-select-text');
    this.hiringManagerInput = page.getByPlaceholder('Type for hints...');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async navigate(): Promise<void> {
    await super.navigate(AddVacancyPage.PATH);
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  async addVacancy() {
    const data = generateVacancyData();
    await this.vacancyNameInput.fill(data.vacancyName);
    await this.jobTitleSelect.click();
    await this.page.getByRole('option', { name: data.jobTitle }).click();
    await this.hiringManagerInput.fill('a');
    await this.page.getByRole('option').filter({ hasNotText: 'Searching' }).first().click();
    await this.saveButton.click();
    await this.page.waitForURL(/addJobVacancy\/\d+/);
    await super.navigate('/web/index.php/recruitment/viewJobVacancy');
    return data;
  }
}
