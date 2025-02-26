import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Manager,
  ManagerProps,
} from '@/domain/management/enterprise/entities/manager';
import { faker } from '@faker-js/faker';

export function makeManager(
  override: Partial<ManagerProps> = {},
  id?: UniqueEntityId,
) {
  const manager = Manager.create(
    {
      email: faker.internet.email(),
      employeeId: faker.number.int({ max: 999999, min: 100 }).toString(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      userName: faker.person.firstName(),
      ...override,
    },
    id,
  );
  return manager;
}
