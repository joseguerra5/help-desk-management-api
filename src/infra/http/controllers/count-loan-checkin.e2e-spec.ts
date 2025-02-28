import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { LoanRecordFactory } from 'test/factories/make-loan-record';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Get loan record check in (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let loanRecordFactory: LoanRecordFactory
  let cooperatorFactory: CooperatorFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory, LoanRecordFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    loanRecordFactory = moduleRef.get(LoanRecordFactory)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /loan_record/check_in", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    await Promise.all([
      loanRecordFactory.makePrismaLoanRecord({
        cooperatorId: cooperator.id,
        madeBy: user.id,
        type: 'CHECK_IN'
      }),

      loanRecordFactory.makePrismaLoanRecord({
        cooperatorId: cooperator.id,
        madeBy: user.id,
        type: 'CHECK_IN'
      })
    ])

    const response = await request(app.getHttpServer())
      .get(`/loan_record/check_in`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.amount).toEqual(2)
  })
})