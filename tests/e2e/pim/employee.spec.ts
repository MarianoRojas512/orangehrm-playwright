import { test, expect } from '@fixtures/fixtures';
import { AddEmployeePage } from '@pages/pim/AddEmployeePage';
import { EmployeeListPage } from '@pages/pim/EmployeeListPage';
import { deleteEmployee } from '@utils/apiHelpers';

test.describe('PIM - Employee', () => {
  let createdEmpNumber: number | null = null;

  test.afterEach(async ({ apiContext }) => {
    if (!createdEmpNumber) return;
    await deleteEmployee(apiContext, createdEmpNumber);
    createdEmpNumber = null;
  });

  test('fixture creates and deletes employee via API', async ({ employee }) => {
    expect(employee.empNumber).toBeTruthy();
    expect(employee.firstName).toBeTruthy();
    expect(employee.lastName).toBeTruthy();
  });

  test('should show validation errors when required fields are empty', { tag: '@regression' }, async ({ page }) => {
    const addEmployeePage = new AddEmployeePage(page);
    await addEmployeePage.navigate();
    await addEmployeePage.saveButton.click();
    await expect(addEmployeePage.validationErrors).toHaveText(['Required', 'Required']);
  });

  test('should show no records when searching for a non-existent employee', { tag: '@regression' }, async ({ page }) => {
    const employeeListPage = new EmployeeListPage(page);
    await employeeListPage.navigate();
    await employeeListPage.employeeNameInput.fill('ZZZNONEXISTENT999');
    await employeeListPage.searchButton.click();
    await expect(employeeListPage.noRecordsToast).toHaveText('No Records Found');
    await expect(employeeListPage.noRecordsText).toHaveText('No Records Found');
  });

  test('should create, verify, and delete employee through UI', { tag: '@regression' }, async ({ page }) => {
    const addEmployeePage = new AddEmployeePage(page);
    const employeeListPage = new EmployeeListPage(page);
    let employee!: Awaited<ReturnType<AddEmployeePage['addEmployee']>>;

    await test.step('Create employee through Add Employee form', async () => {
      await addEmployeePage.navigate();
      employee = await addEmployeePage.addEmployee();
      createdEmpNumber = employee.empNumber;
    });

    await test.step('Verify employee appears in the list', async () => {
      await employeeListPage.navigate();
      await employeeListPage.searchEmployeeByName(employee);
      await expect(employeeListPage.getEmployeeRow(employee.firstName, employee.lastName)).toBeVisible();
    });

    await test.step('Delete employee through UI', async () => {
      await employeeListPage.deleteEmployee(employee.firstName, employee.lastName);
      await expect(employeeListPage.getEmployeeRow(employee.firstName, employee.lastName)).not.toBeVisible();
    });
  });
});