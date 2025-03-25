import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CallLogRepository, Count } from '@/domain/management/application/repositories/call-log-repository';
import { CallLog } from '@/domain/management/enterprise/entities/callLog';
import { PrismaCallLogMapper } from '../mappers/prisma-call-log-mapper';

@Injectable()
export class PrismaCallLogRepository implements CallLogRepository {
  constructor(private prisma: PrismaService) { }
  async count({ from, to }: Count): Promise<number> {
    const count = await this.prisma.callLog.count({
      where: {
        createdAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : new Date(),
        },
      },
    });

    return count;
  }
  async save(callLog: CallLog): Promise<void> {
    const data = PrismaCallLogMapper.toPersistence(callLog);

    await this.prisma.callLog.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async findById(id: string): Promise<CallLog | null> {
    const callLog = await this.prisma.callLog.findUnique({
      where: {
        id,
      },
    });

    if (!callLog) {
      return null;
    }

    return PrismaCallLogMapper.toDomain(callLog);
  }
  async findManyByCooperatorId(cooperatorId: string): Promise<CallLog[]> {
    const callLogs = await this.prisma.callLog.findMany({
      where: {
        cooperatorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return callLogs.map(PrismaCallLogMapper.toDomain);
  }

  async create(callLog: CallLog): Promise<void> {
    const data = PrismaCallLogMapper.toPersistence(callLog);

    await this.prisma.callLog.create({
      data,
    });
  }
}
