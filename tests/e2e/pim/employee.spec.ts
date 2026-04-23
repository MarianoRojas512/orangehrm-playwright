import { test, expect } from '@fixtures/fixtures';

test('fixture creates and deletes employee via API', async ({ employee }) => {
  expect(employee.empNumber).toBeTruthy();
  expect(employee.firstName).toBeTruthy();
  expect(employee.lastName).toBeTruthy();
});
