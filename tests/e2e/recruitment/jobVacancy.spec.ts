import { test, expect } from '@fixtures/fixtures';
import { AddVacancyPage } from '@pages/recruitment/AddVacancyPage';
import { VacanciesPage } from '@pages/recruitment/VacanciesPage';

test.describe('Recruitment - Vacancies', () => {
  let createdVacancyName: string | null = null;

  test.afterEach(async ({ page }) => {
    if (!createdVacancyName) return;
    const vacanciesPage = new VacanciesPage(page);
    await vacanciesPage.navigate();
    try {
      await vacanciesPage.getVacancyRow(createdVacancyName).waitFor({ state: 'visible', timeout: 10000 });
      await vacanciesPage.selectVacancyCheckbox(createdVacancyName);
      await vacanciesPage.deleteSelected();
    } catch {
      // vacancy not found or already deleted
    }
    createdVacancyName = null;
  });

  test('should create, verify, and delete vacancy', { tag: '@regression' }, async ({ page }) => {
    const addVacancyPage = new AddVacancyPage(page);
    const vacanciesPage = new VacanciesPage(page);
    let vacancyName!: string;

    await test.step('Create vacancy through Add Vacancy form', async () => {
      await addVacancyPage.navigate();
      const data = await addVacancyPage.addVacancy();
      createdVacancyName = vacancyName = data.vacancyName;
    });

    await test.step('Verify vacancy appears in list', async () => {
      await expect(vacanciesPage.getVacancyRow(vacancyName)).toBeVisible();
    });

    await test.step('Delete vacancy via checkbox', async () => {
      await vacanciesPage.selectVacancyCheckbox(vacancyName);
      await vacanciesPage.deleteSelected();
      await expect(vacanciesPage.getVacancyRow(vacancyName)).not.toBeVisible();
    });
  });
});
