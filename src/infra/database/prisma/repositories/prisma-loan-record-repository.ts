import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationLoanRecordParams } from '@/core/repositories/pagination-param';
import {
  Count,
  FindManyLoanRecords,
  LoanRecordRepository,
} from '@/domain/management/application/repositories/loan-record-repository';
import { LoanRecord } from '@/domain/management/enterprise/entities/loan-record';
import { PrismaLoanRecordMapper } from '../mappers/prisma-loan-record-mapper';
import { LoanRecordType } from '@prisma/client';
import { PDFAttachmentRepository } from '@/domain/management/application/repositories/PDF-attachment-repository';

@Injectable()
export class PrismaLoanRecordRepository implements LoanRecordRepository {
  constructor(
    private prisma: PrismaService,
    private PDFattachmentRepository: PDFAttachmentRepository
  ) { }
  async findMany({ page, status }: PaginationLoanRecordParams): Promise<FindManyLoanRecords> {
    const whereCondition = status ? { type: status === 'CHECK_IN' ? LoanRecordType.CHECK_IN : LoanRecordType.CHECK_OUT } : {};

    const totalCount = await this.prisma.loanRecord.count({
      where: whereCondition
    });
    const loanRecords = await this.prisma.loanRecord.findMany({
      where: whereCondition,
      include: {
        madeByUser: true,
        cooperator: true,
      },
      orderBy: {
        ocurredAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return {
      data: loanRecords.map(PrismaLoanRecordMapper.toDomain),
      meta: {
        totalCount,
        perPage: 20,
        pageIndex: page
      }
    }
  }

  async count({ from, status }: Count): Promise<number> {
    const count = await this.prisma.loanRecord.count({
      where: {
        type: status,
        ocurredAt: from ? { gte: new Date(from) } : undefined,
      },
    });
    return count;
  }

  async findManyByCooperatorId(
    cooperatorId: string,
    { page, status }: PaginationLoanRecordParams,
  ): Promise<LoanRecord[]> {
    const loanrecords = await this.prisma.loanRecord.findMany({
      where: {
        cooperatorId,
        type: status ? (status.toUpperCase() as LoanRecordType) : undefined,
      },
      include: { attachment: true },
      orderBy: {
        ocurredAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return loanrecords.map(PrismaLoanRecordMapper.toDomain);
  }

  async save(loanrecord: LoanRecord): Promise<void> {
    const data = PrismaLoanRecordMapper.toPersistence(loanrecord);

    await this.prisma.loanRecord.update({
      where: {
        id: data.id,
      },
      data,
    });

    await this.PDFattachmentRepository.create(loanrecord.attachment)
  }

  async findById(id: string): Promise<LoanRecord | null> {
    const loanrecord = await this.prisma.loanRecord.findUnique({
      where: {
        id,
      },
    });

    if (!loanrecord) {
      return null;
    }

    return PrismaLoanRecordMapper.toDomain(loanrecord);
  }

  async create(loanrecord: LoanRecord): Promise<void> {
    const data = PrismaLoanRecordMapper.toPersistence(loanrecord);

    await this.prisma.loanRecord.create({
      data,
    });
  }
}
