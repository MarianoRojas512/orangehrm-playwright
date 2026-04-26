import { test, expect } from '@fixtures/fixtures';
import { generateEmployeeData } from '@utils/testData';

test.describe('API - Employees', () => {
  test('should return employee list with valid structure', async ({ apiContext }) => {
    const response = await apiContext.get('/web/index.php/api/v2/pim/employees', {
      params: { limit: 50, offset: 0, model: 'detailed', includeEmployees: 'onlyCurrent' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.meta.total).toBe('number');

    const first = body.data[0];
    expect(typeof first.empNumber).toBe('number');
    expect(typeof first.firstName).toBe('string');
    expect(typeof first.lastName).toBe('string');
  });

  test('should delete an employee and verify it no longer exists', async ({ apiContext }) => {
    const data = generateEmployeeData();

    const createResponse = await apiContext.post('/web/index.php/api/v2/pim/employees', {
      data: { ...data, empPicture: null },
    });
    const { empNumber } = (await createResponse.json()).data;

    const deleteResponse = await apiContext.delete('/web/index.php/api/v2/pim/employees', {
      data: { ids: [empNumber] },
    });
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await apiContext.get('/web/index.php/api/v2/pim/employees', {
      params: { nameOrId: data.employeeId },
    });
    expect(getResponse.status()).toBe(200);
    const getBody = await getResponse.json();
    expect(getBody.data).toHaveLength(0);
    expect(getBody.meta.total).toBe(0);
  });

  test('should return 422 when creating employee without required fields', async ({ apiContext }) => {
    const data = generateEmployeeData();

    const response = await apiContext.post('/web/index.php/api/v2/pim/employees', {
      data: { middleName: data.middleName, lastName: data.lastName, empPicture: null },
    });

    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.error.status).toBe('422');
    expect(body.error.data.invalidParamKeys).toContain('firstName');
  });

  test('should create an employee and return valid data', async ({ apiContext }) => {
    const data = generateEmployeeData();

    const response = await apiContext.post('/web/index.php/api/v2/pim/employees', {
      data: { ...data, empPicture: null },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(typeof body.data.empNumber).toBe('number');
    expect(body.data.firstName).toBe(data.firstName);
    expect(body.data.middleName).toBe(data.middleName);
    expect(body.data.lastName).toBe(data.lastName);
    expect(body.data.terminationId).toBeNull();

    await apiContext.delete('/web/index.php/api/v2/pim/employees', {
      data: { ids: [body.data.empNumber] },
    });
  });
});