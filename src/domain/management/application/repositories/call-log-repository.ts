import { CallLog } from '../../enterprise/entities/callLog';

export interface Count {
  from?: Date;
  to?: Date;
}

export abstract class CallLogRepository {
  abstract create(callLog: CallLog): Promise<void>;
  abstract save(callLog: CallLog): Promise<void>;
  abstract findById(id: string): Promise<CallLog | null>;
  abstract findManyByCooperatorId(cooperatorId: string): Promise<CallLog[]>;
  abstract count(params: Count): Promise<number>;
}
