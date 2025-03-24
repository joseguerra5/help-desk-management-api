import { CallLogRepository, Count } from '@/domain/management/application/repositories/call-log-repository';
import { CallLog } from '@/domain/management/enterprise/entities/callLog';

export class InMemoryCallLogRepository implements CallLogRepository {
  public items: CallLog[] = [];
  async count({ from, to }: Count): Promise<number> {
    const amount = this.items.filter((item) => {
      const itemDate = new Date(item.createdAt);

      const matchesFrom = from ? itemDate >= new Date(from) : true;
      const matchesTo = to ? itemDate <= new Date(to) : true;

      return matchesFrom && matchesTo;
    }).length;

    return amount;
  }

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
