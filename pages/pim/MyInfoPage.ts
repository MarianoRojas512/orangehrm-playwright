import { Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BasePage } from '@pages/BasePage';

export class MyInfoPage extends BasePage {
  private static readonly PATH = '/web/index.php/pim/viewMyDetails';

  readonly employeeNameHeading: Locator;

  readonly personalDetailsTab: Locator;
  readonly contactDetailsTab: Locator;
  readonly emergencyContactsTab: Locator;
  readonly dependentsTab: Locator;
  readonly immigrationTab: Locator;
  readonly jobTab: Locator;
  readonly salaryTab: Locator;
  readonly reportToTab: Locator;
  readonly qualificationsTab: Locator;
  readonly membershipsTab: Locator;

  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly otherIdInput: Locator;
  readonly driversLicenseInput: Locator;
  readonly licenseExpiryDateInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly nationalityDropdown: Locator;
  readonly maritalStatusDropdown: Locator;
  readonly maleRadio: Locator;
  readonly femaleRadio: Locator;
  readonly personalDetailsSaveButton: Locator;
  readonly firstNameRequiredMessage: Locator;
  readonly lastNameRequiredMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameHeading = page.getByRole('heading', { level: 6 }).first();

    this.personalDetailsTab = page.getByRole('tab', { name: 'Personal Details' });
    this.contactDetailsTab = page.getByRole('tab', { name: 'Contact Details' });
    this.emergencyContactsTab = page.getByRole('tab', { name: 'Emergency Contacts' });
    this.dependentsTab = page.getByRole('tab', { name: 'Dependents' });
    this.immigrationTab = page.getByRole('tab', { name: 'Immigration' });
    this.jobTab = page.getByRole('tab', { name: 'Job' });
    this.salaryTab = page.getByRole('tab', { name: 'Salary' });
    this.reportToTab = page.getByRole('tab', { name: 'Report-to' });
    this.qualificationsTab = page.getByRole('tab', { name: 'Qualifications' });
    this.membershipsTab = page.getByRole('tab', { name: 'Memberships' });

    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.getByLabel('Employee Id');
    this.otherIdInput = page.getByLabel('Other Id');
    this.driversLicenseInput = page.getByLabel("Driver's License Number");
    this.licenseExpiryDateInput = page.getByRole('textbox', { name: 'yyyy-dd-mm' }).first();
    this.dateOfBirthInput = page.getByRole('textbox', { name: 'yyyy-dd-mm' }).nth(1);
    this.nationalityDropdown = page.locator('.oxd-input-group', { hasText: 'Nationality' }).locator('.oxd-select-text');
    this.maritalStatusDropdown = page.locator('.oxd-input-group', { hasText: 'Marital Status' }).locator('.oxd-select-text');
    this.maleRadio = page.getByRole('radio', { name: 'Male', exact: true });
    this.femaleRadio = page.getByRole('radio', { name: 'Female', exact: true });
    this.personalDetailsSaveButton = page.locator('form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: 'Save' });
    this.firstNameRequiredMessage = page.getByText('Required').first();
    this.lastNameRequiredMessage = page.getByText('Required').nth(1);
  }

  async navigate(): Promise<void> {
    await super.navigate(MyInfoPage.PATH);
  }

  async editPersonalDetails() {
    const data = {
      firstName: faker.person.firstName(),
      middleName: faker.person.middleName(),
      lastName: faker.person.lastName(),
      nationality: faker.helpers.arrayElement(['Argentinean', 'Brazilian', 'Canadian', 'Indian', 'Japanese']),
      maritalStatus: faker.helpers.arrayElement(['Single', 'Married', 'Other']),
      gender: faker.helpers.arrayElement(['Male', 'Female']) as 'Male' | 'Female',
    };

    await this.firstNameInput.fill(data.firstName);
    await this.middleNameInput.fill(data.middleName);
    await this.lastNameInput.fill(data.lastName);
    await this.nationalityDropdown.click();
    await this.page.getByRole('option', { name: data.nationality }).click();
    await this.maritalStatusDropdown.click();
    await this.page.getByRole('option', { name: data.maritalStatus }).click();
    await this.page.getByRole('radio', { name: data.gender, exact: true }).click({ force: true });
    await this.personalDetailsSaveButton.click();

    return data;
  }
}