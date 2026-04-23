import { faker } from '@faker-js/faker';

export function generateEmployeeData() {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    employeeId: String(faker.number.int({ min: 1000, max: 9999 })),
  };
}