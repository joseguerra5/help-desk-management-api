import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { CooperatorEquipmentFactory } from 'test/factories/make-cooperator-equipment';
import { EquipmentFactory } from 'test/factories/make-equipment';
import { LoanRecordFactory } from 'test/factories/make-loan-record';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Get loan record by Id (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let cooperatorFactory: CooperatorFactory
  let loanRecordFactory: LoanRecordFactory
  let equipmentFactory: EquipmentFactory
  let cooperatorEquipmentFactory: CooperatorEquipmentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory, LoanRecordFactory, EquipmentFactory, CooperatorEquipmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    loanRecordFactory = moduleRef.get(LoanRecordFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    cooperatorEquipmentFactory = moduleRef.get(CooperatorEquipmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /loan_record/:loanRecordId", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const cooperator = await cooperatorFactory.makePrismaCooperator()
    const equipment = await equipmentFactory.makePrismaEquipment()
    const cooperatorEquipment = await cooperatorEquipmentFactory.makePrismaCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment.id
    })


    const loanRecord = await loanRecordFactory.makePrismaLoanRecord({
      cooperatorId: cooperator.id,
      equipments: [cooperatorEquipment],
      madeBy: user.id
    })


    const response = await request(app.getHttpServer())
      .get(`/loan_record/${loanRecord.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

  })
})