import { test, expect } from '@playwright/test';
import { MyInfoPage } from '@pages/pim/MyInfoPage';

test.describe('My Info', () => {
  let myInfoPage: MyInfoPage;

  test.beforeEach(async ({ page }) => {
    myInfoPage = new MyInfoPage(page);
    await myInfoPage.navigate();
  });

  test('should show required errors when first and last name are cleared', async () => {
    await expect(myInfoPage.firstNameInput).not.toHaveValue('');

    await test.step('Clear required fields and submit', async () => {
      await myInfoPage.firstNameInput.clear();
      await myInfoPage.lastNameInput.clear();
      await myInfoPage.personalDetailsSaveButton.click();
    });

    await test.step('Verify validation messages', async () => {
      await expect(myInfoPage.firstNameRequiredMessage).toBeVisible();
      await expect(myInfoPage.lastNameRequiredMessage).toBeVisible();
   2 });
  });

  test('should save personal details successfully', async () => {
    await expect(myInfoPage.firstNameInput).not.toHaveValue('');
    const data = await myInfoPage.editPersonalDetails();

    await expect(myInfoPage.firstNameInput).toHaveValue(data.firstName);
    await expect(myInfoPage.middleNameInput).toHaveValue(data.middleName);
    await expect(myInfoPage.lastNameInput).toHaveValue(data.lastName);
    await expect(myInfoPage.nationalityDropdown).toContainText(data.nationality);
    await expect(myInfoPage.maritalStatusDropdown).toContainText(data.maritalStatus);
    const genderRadio = data.gender === 'Male' ? myInfoPage.maleRadio : myInfoPage.femaleRadio;
    await expect(genderRadio).toBeChecked();
  });
});