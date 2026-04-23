import { test as base, request as playwrightRequest } from '@playwright/test';
import { createEmployee, deleteEmployee, type Employee } from '@utils/apiHelpers';
import { generateEmployeeData } from '@utils/testData';

type Fixtures = {
  employee: Employee;
};

export const test = base.extend<Fixtures>({
  employee: async ({}, use) => {
    const apiContext = await playwrightRequest.newContext({
      baseURL: 'https://opensource-demo.orangehrmlive.com',
      storageState: '.playwright/.auth/user.json',
    });
    const data = generateEmployeeData();
    const employee = await createEmployee(apiContext, data);
    await use(employee);
    await deleteEmployee(apiContext, employee.empNumber);
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';
