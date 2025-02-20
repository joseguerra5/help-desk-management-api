import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PDFAttachment } from './PDF-attachment';
import { Optional } from '@/core/types/optional';
import { Equipment } from './equipment';

export type RecordType = "CHECK_IN" | "CHECK_OUT"
export interface LoanRecordProps {
  cooperatorId: UniqueEntityId;
  madeBy: UniqueEntityId
  type: RecordType
  equipments: Equipment[]
  ocurredAt?: Date;
  attachment?: PDFAttachment | null
}

export class LoanRecord extends Entity<LoanRecordProps> {
  get cooperatorId() {
    return this.props.cooperatorId;
  }

  set cooperatorId(cooperatorId: UniqueEntityId) {
    this.props.cooperatorId = cooperatorId;
    this.touch();
  }

  get madeBy() {
    return this.props.madeBy;
  }

  get computer() {
    return this.props.computer;
  }

  set computer(computer: string) {
    this.props.computer = computer;
    this.touch();
  }

  get monitor() {
    return this.props.monitor;
  }

  set monitor(monitor: string) {
    this.props.monitor = monitor;
    this.touch();
  }

  get headset() {
    return this.props.headset;
  }

  set headset(headset: string) {
    this.props.headset = headset;
    this.touch();
  }

  get keyboard() {
    return this.props.keyboard;
  }

  set keyboard(keyboard: string) {
    this.props.keyboard = keyboard;
    this.touch();
  }

  get mouse() {
    return this.props.mouse;
  }

  set mouse(mouse: string) {
    this.props.mouse = mouse;
    this.touch();
  }


  get blm() {
    return this.props.blm;
  }

  set blm(blm: string) {
    this.props.blm = blm;
    this.touch();
  }

  get iccid() {
    return this.props.iccid;
  }

  set iccid(iccid: string) {
    this.props.iccid = iccid;
    this.touch();
  }

  get others() {
    return this.props.others;
  }

  set others(others: string) {
    this.props.others = others;
    this.touch();
  }


  get ocurredAt() {
    return this.props.ocurredAt;
  }


  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<LoanRecordProps, "ocurredAt" | "attachment">, id?: UniqueEntityId): LoanRecord {
    const loanrecord = new LoanRecord({
      ...props,
      ocurredAt: props.ocurredAt ?? new Date(),
      attachment: props.attachment ?? null
    }, id);

    return loanrecord;
  }
}
