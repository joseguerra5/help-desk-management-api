import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  private value: string;

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  equal(id: UniqueEntityId) {
    return this.value === id.toValue();
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}
