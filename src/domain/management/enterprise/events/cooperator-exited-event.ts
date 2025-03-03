import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Cooperator } from "../entities/cooperator";

export class CooperatorExitedEvent implements DomainEvent {
  public cooperator: Cooperator
  public ocurredAt: Date;

  constructor(
    cooperator: Cooperator,
    ocurredAt: Date
  ) {
    this.cooperator = cooperator
    this.ocurredAt = ocurredAt ?? new Date(); // Momento em que o evento foi disparado
  }

  getAggregateId(): UniqueEntityId {
    return this.cooperator.id
  }
}