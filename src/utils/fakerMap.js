import { faker } from "@faker-js/faker";

const fakerMap = {
  name: () => faker.person.fullName(),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),

  email: () => faker.internet.email(),
  username: () => faker.internet.username(),
  password: () => faker.internet.password(),

  sentence: () => faker.lorem.sentence(),
  paragraph: () => faker.lorem.paragraph(),
  word: () => faker.lorem.word(),

  number: () => faker.number.int(),
  float: () => faker.number.float(),
  boolean: () => faker.datatype.boolean(),

  uuid: () => faker.string.uuid(),
  date: () => faker.date.past(),

  city: () => faker.location.city(),
  country: () => faker.location.country(),
  street: () => faker.location.streetAddress(),

  company: () => faker.company.name(),
  jobTitle: () => faker.person.jobTitle(),

  phone: () => faker.phone.number(),
  url: () => faker.internet.url(),
  image: () => faker.image.url(),
};

export default fakerMap;
