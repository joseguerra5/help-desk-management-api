import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { LoanRecordFactory } from 'test/factories/make-loan-record';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Edit Cooperator Inventory (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let cooperatorFactory: CooperatorFactory
  let loanRecordFactory: LoanRecordFactory
  let attachmentFactory: AttachmentFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory, AttachmentFactory, LoanRecordFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    prisma = moduleRef.get(PrismaService)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    loanRecordFactory = moduleRef.get(LoanRecordFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[POST] /cooperator/:cooperatorId/loanRecord/:loanRecordId", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const cooperator = await cooperatorFactory.makePrismaCooperator()
    const loanRecord = await loanRecordFactory.makePrismaLoanRecord({
      cooperatorId: cooperator.id,
      madeBy: user.id
    })
    const attachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .post(`/cooperator/${cooperator.id.toString()}/loanRecord/${loanRecord.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId: attachment.id.toString()
      })

    expect(response.statusCode).toBe(201)


    const attachmentOnDatabase = await prisma.attachment.findFirst({
      where: {
        id: attachment.id.toString()
      }
    })

    expect(attachmentOnDatabase?.loanRecordId).toBeTruthy()
  })
})