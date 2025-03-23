import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { LoanRecordFactory } from 'test/factories/make-loan-record';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Get presigned attachment url", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory, AttachmentFactory, LoanRecordFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /attachment/:attachmentId", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const response = await request(app.getHttpServer())
      .get(`/attachment/${attachment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    console.log("resultado", response.body)

    expect(response.statusCode).toBe(200)


  })
})