import { test, expect } from '@playwright/test';
import { MyInfoPage } from '@pages/pim/MyInfoPage';

test.describe('My Info', () => {
  let myInfoPage: MyInfoPage;

  test.beforeEach(async ({ page }) => {
    myInfoPage = new MyInfoPage(page);
    await myInfoPage.navigate();
  });

  test('should save personal details successfully', async () => {
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