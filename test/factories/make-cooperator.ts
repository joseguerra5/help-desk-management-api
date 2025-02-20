import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Cooperator, CooperatorProps } from "@/domain/management/enterprise/entities/cooperator";
import { faker } from "@faker-js/faker"


export function makeCooperator(
  override: Partial<CooperatorProps> = {},
  id?: UniqueEntityId
) {
  const cooperator = Cooperator.create({
    email: faker.internet.email(),
    employeeId: faker.number.int({ max: 999999, min: 100 }).toString(),
    name: faker.person.fullName(),
    userName: faker.person.firstName(),
    phone: faker.phone.number(),
    ...override
  }, id)
  return cooperator
}