import { test, expect } from '@fixtures/fixtures';
import { AssignLeavePage } from '@pages/leave/AssignLeavePage';
import { LeaveListPage } from '@pages/leave/LeaveListPage';

test.describe('Leave - Assign Leave', () => {
  test('should assign leave to employee and appear in leave list', { tag: '@regression' }, async ({ page, employee }) => {
    const assignLeavePage = new AssignLeavePage(page);
    const leaveListPage = new LeaveListPage(page);

    const leaveType = 'CAN - Vacation';
    const fromDate = '2026-05-01';
    const toDate = '2026-05-07';

    await test.step('Fill and submit the Assign Leave form', async () => {
      await assignLeavePage.navigate();
      await assignLeavePage.employeeNameInput.fill(employee.firstName);
      await page.getByRole('option', { name: `${employee.firstName} ${employee.middleName} ${employee.lastName}` }).click();
      await assignLeavePage.leaveTypeDropdown.click();
      await page.getByRole('option', { name: leaveType }).click();
      await assignLeavePage.fillDate(assignLeavePage.fromDateInput, fromDate);
      await assignLeavePage.fillDate(assignLeavePage.toDateInput, toDate);
      await assignLeavePage.pageHeading.click();
      await assignLeavePage.partialDaysDropdown.waitFor({ state: 'visible' });
      await assignLeavePage.partialDaysDropdown.click();
      await page.getByRole('option', { name: 'All Days' }).click();
      await assignLeavePage.durationDropdown.click();
      await page.getByRole('option', { name: 'Specify Time' }).click();
      await assignLeavePage.assignButton.click();
    });

    await test.step('Confirm leave assignment modal', async () => {
      await expect(assignLeavePage.confirmModal).toBeVisible();
      await assignLeavePage.confirmOkButton.click();
    });

    await test.step('Verify leave appears in Leave List', async () => {
      await leaveListPage.navigate();
      await leaveListPage.employeeNameInput.fill(employee.firstName);
      await page.getByRole('option', { name: `${employee.firstName} ${employee.middleName} ${employee.lastName}` }).click();
      await leaveListPage.leaveTypeDropdown.click();
      await page.getByRole('option', { name: leaveType }).click();
      await leaveListPage.fillDate(leaveListPage.fromDateInput, fromDate);
      await leaveListPage.fillDate(leaveListPage.toDateInput, toDate);
      await leaveListPage.leaveStatusDropdown.click();
      await page.getByRole('option', { name: 'Scheduled' }).click();
      await leaveListPage.searchButton.click();
      const row = leaveListPage.getLeaveRow(`${employee.firstName} ${employee.middleName} ${employee.lastName}`);
      await expect(row).toBeVisible();
      await expect(row).toContainText('Scheduled');
    });
  });
});
