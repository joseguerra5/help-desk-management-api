import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AttachmentRepository } from '@/domain/management/application/repositories/attachment-repository';
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository';
import { CallLogRepository } from '@/domain/management/application/repositories/call-log-repository';
import { PrismaCallLogRepository } from './prisma/repositories/prisma-call-log-repository';
import { CooperatorRepository } from '@/domain/management/application/repositories/cooperator-repository';
import { PrismaCooperatorRepository } from './prisma/repositories/prisma-cooperator-repository';
import { CooperatorEquipmentRepository } from '@/domain/management/application/repositories/cooperator-equipment-repository';
import { PrismaCooperatorEquipmentRepository } from './prisma/repositories/prisma-cooperator-equipment-repository';
import { PrismaEquipmentRepository } from './prisma/repositories/prisma-equipments-repository';
import { LoanRecordRepository } from '@/domain/management/application/repositories/loan-record-repository';
import { PrismaLoanRecordRepository } from './prisma/repositories/prisma-loan-record-repository';
import { ManagerRepository } from '@/domain/management/application/repositories/manager-repository';
import { PrismaManagerRepository } from './prisma/repositories/prisma-manager-repository';
import { EquipmentRepository } from '@/domain/management/application/repositories/equipment-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: CallLogRepository,
      useClass: PrismaCallLogRepository,
    },
    {
      provide: CooperatorRepository,
      useClass: PrismaCooperatorRepository,
    },
    {
      provide: CooperatorEquipmentRepository,
      useClass: PrismaCooperatorEquipmentRepository,
    },
    {
      provide: EquipmentRepository,
      useClass: PrismaEquipmentRepository,
    },
    {
      provide: LoanRecordRepository,
      useClass: PrismaLoanRecordRepository,
    },
    {
      provide: ManagerRepository,
      useClass: PrismaManagerRepository,
    },
  ],
  exports: [
    PrismaService,
    AttachmentRepository,
    CallLogRepository,
    CooperatorRepository,
    CooperatorEquipmentRepository,
    EquipmentRepository,
    LoanRecordRepository,
    ManagerRepository,
  ],
})
export class DatabaseModule { }
