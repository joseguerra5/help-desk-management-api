import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface ManagerProps {
  name: string;
  userName: string;
  employeeId: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Manager extends Entity<ManagerProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get userName() {
    return this.props.userName;
  }

  set userName(userName: string) {
    this.props.userName = userName;
    this.touch();
  }

  get employeeId() {
    return this.props.employeeId;
  }

  set employeeId(employeeId: UniqueEntityId) {
    this.props.employeeId = employeeId;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
  static create(props: Optional<ManagerProps, "createdAt">, id?: UniqueEntityId): Manager {
    const manager = new Manager({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id);

    return manager;
  }
}
