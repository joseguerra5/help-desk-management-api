import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export type CallType = "Technical Issue" | "Citrix Issue" | "Procedure Question" | "Other"

export type CallStatus = "Open" | "Closed" | "In Progress"

export interface CallLogProps {
  cooperatorId: UniqueEntityId
  madeBy: UniqueEntityId
  type: CallType
  status: CallStatus
  description: string
  createdAt: Date
  updatedAt?: Date | null
}

export class CallLog extends Entity<CallLogProps> {
  get cooperatorId() {
    return this.props.cooperatorId;
  }

  get madeBy() {
    return this.props.madeBy;
  }

  set cooperatorId(cooperatorId: UniqueEntityId) {
    this.props.cooperatorId = cooperatorId;
    this.touch();
  }

  get type() {
    return this.props.type;
  }

  set type(type: CallType) {
    this.props.type = type;
    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(status: CallStatus) {
    this.props.status = status;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
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
  static create(props: Optional<CallLogProps, "createdAt">, id?: UniqueEntityId): CallLog {
    const calllog = new CallLog({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return calllog;
  }
}
