import { Entity } from '@/core/entities/entity';
import { EquipmentList } from './inventory-list';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface CooperatorProps {
  name: string;
  userName: string;
  employeeId: number;
  nif?: number;
  phone: string;
  email: string;
  createdAt: Date;
  inventory: EquipmentList
  departureDate?: Date | null;
  updatedAt?: Date | null;
}

export class Cooperator extends Entity<CooperatorProps> {
  static create(props: CooperatorProps, id?: UniqueEntityId): Cooperator {
    const cooperator = new Cooperator(props, id);

    return cooperator;
  }
}
