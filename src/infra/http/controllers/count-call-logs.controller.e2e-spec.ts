import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CallLogFactory } from 'test/factories/make-call-log';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { CooperatorEquipmentFactory } from 'test/factories/make-cooperator-equipment';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Fetch Equipments (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let callLogsFactory: CallLogFactory
  let cooperatorFactory: CooperatorFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CallLogFactory, CooperatorFactory, CooperatorEquipmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    callLogsFactory = moduleRef.get(CallLogFactory)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /equipments", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    for (let i = 1; i <= 22; i++) {
      await callLogsFactory.makePrismaCallLog(
        { createdAt: new Date(2025, 2, i), cooperatorId: cooperator.id, madeBy: user.id },
      );
    }

    await callLogsFactory.makePrismaCallLog(
      { createdAt: new Date(2025, 1, 1), cooperatorId: cooperator.id, madeBy: user.id },
    );

    const response = await request(app.getHttpServer())
      .get(`/metrics/call_logs`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.currentMonthAmount).toEqual(22)
    expect(response.body.previousMonthAmount).toEqual(1)
  })
})