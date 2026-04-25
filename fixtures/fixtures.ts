import { test as base, request as playwrightRequest, type APIRequestContext } from '@playwright/test';
import { createEmployee, deleteEmployee, type Employee } from '@utils/apiHelpers';
import { generateEmployeeData } from '@utils/testData';

type Fixtures = {
  apiContext: APIRequestContext;
  employee: Employee;
};

export const test = base.extend<Fixtures>({
  apiContext: async ({}, use) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: 'https://opensource-demo.orangehrmlive.com',
      storageState: '.playwright/.auth/user.json',
    });
    await use(ctx);
    await ctx.dispose();
  },

  employee: async ({ apiContext }, use) => {
    const data = generateEmployeeData();
    const employee = await createEmployee(apiContext, data);
    await use(employee);
    await deleteEmployee(apiContext, employee.empNumber);
  },
});

export { expect } from '@playwright/test';
