import { faker } from '@faker-js/faker';

const JOB_TITLES = ['QA Engineer', 'QA Lead', 'Software Engineer', 'Software Architect'];

export function generateEmployeeData() {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    employeeId: String(faker.number.int({ min: 1000, max: 9999 })),
  };
}

export function generateVacancyData() {
  return {
    vacancyName: `${faker.person.jobTitle()} ${faker.number.int({ min: 100, max: 999 })}`,
    jobTitle: faker.helpers.arrayElement(JOB_TITLES),
  };
}