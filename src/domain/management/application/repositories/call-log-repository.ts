import { CallLog } from '../../enterprise/entities/callLog';

export abstract class CallLogRepository {
  abstract create(callLog: CallLog): Promise<void>;
  abstract save(callLog: CallLog): Promise<void>;
  abstract findById(id: string): Promise<CallLog | null>;
  abstract findManyByCooperatorId(cooperatorId: string): Promise<CallLog[]>;
}
