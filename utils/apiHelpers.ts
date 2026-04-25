import { APIRequestContext } from '@playwright/test';

type EmployeeInput = {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
};

export type Employee = {
  empNumber: number;
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
};

export async function createEmployee(
  request: APIRequestContext,
  data: EmployeeInput,
): Promise<Employee> {
  const response = await request.post('/web/index.php/api/v2/pim/employees', {
    data: { ...data, empPicture: null },
  });
  const body = await response.json();
  return body.data;
}

export async function deleteEmployee(
  request: APIRequestContext,
  empNumber: number,
): Promise<void> {
  await request.delete('/web/index.php/api/v2/pim/employees', {
    data: { ids: [empNumber] },
  });
}

export async function findEmployeeByName(
  request: APIRequestContext,
  name: string,
): Promise<Employee | null> {
  const response = await request.get('/web/index.php/api/v2/pim/employees', {
    params: { nameOrId: name },
  });
  const body = await response.json();
  return body.data[0] ?? null;
}
