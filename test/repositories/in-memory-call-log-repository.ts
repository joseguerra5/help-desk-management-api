import { CallLogRepository } from '@/domain/management/application/repositories/call-log-repository';
import { CallLog } from '@/domain/management/enterprise/entities/callLog';

export class InMemoryCallLogRepository implements CallLogRepository {
  public items: CallLog[] = [];

  async create(callLog: CallLog): Promise<void> {
    this.items.push(callLog);
  }

  async save(callLog: CallLog): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(callLog.id),
    );

    this.items[itemIndex] = callLog;
  }

  async findById(id: string): Promise<CallLog | null> {
    const callLog = this.items.find((item) => item.id.toString() === id);

    if (!callLog) {
      return null;
    }

    return callLog;
  }

  async findManyByCooperatorId(cooperatorId: string): Promise<CallLog[]> {
    const callLogs = this.items.filter(
      (item) => item.cooperatorId.toString() === cooperatorId,
    );

    return callLogs;
  }
}
