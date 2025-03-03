import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { InventoryList } from './inventory-list';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { CooperatorExitedEvent } from '../events/cooperator-exited-event';

export interface CooperatorProps {
  name: string;
  userName: string;
  employeeId: string;
  nif?: string | null;
  phone: string;
  email: string;
  inventory: InventoryList;
  createdAt?: Date;
  departureDate?: Date | null;
  updatedAt?: Date | null;
}

export class Cooperator extends AggregateRoot<CooperatorProps> {
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

  set employeeId(employeeId: string) {
    this.props.employeeId = employeeId;
    this.touch();
  }

  get nif() {
    return this.props.nif;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get inventory() {
    return this.props.inventory;
  }

  set inventory(inventory: InventoryList) {
    this.props.inventory = inventory;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get departureDate() {
    return this.props.departureDate;
  }

  set departureDate(departureDate: Date) {
    if (departureDate === undefined) {
      return
    }

    if (this.props.departureDate === undefined || this.props.departureDate !== departureDate) {
      this.addDomainEvent(new CooperatorExitedEvent(this, departureDate));
    }

    this.props.departureDate = departureDate;
    this.touch();

  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<CooperatorProps, 'createdAt' | 'inventory' | "nif">,
    id?: UniqueEntityId,
  ): Cooperator {
    const cooperator = new Cooperator(
      {
        ...props,
        inventory: props.inventory ?? new InventoryList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return cooperator;
  }
}
