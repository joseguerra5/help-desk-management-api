import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CallLogFactory } from 'test/factories/make-call-log';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Fetch CallLogs (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let cooperatorFactory: CooperatorFactory
  let callLogsFactory: CallLogFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory, CallLogFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    callLogsFactory = moduleRef.get(CallLogFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /cooperator/:cooperatorId/call_logs", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    for (let i = 1; i <= 22; i++) {
      await callLogsFactory.makePrismaCallLog(
        {
          createdAt: new Date(2024, 11, i),
          cooperatorId: cooperator.id,
          madeBy: user.id
        },
      );
    }
    const response = await request(app.getHttpServer())
      .get(`/cooperator/${cooperator.id.toString()}/call_logs`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.callLogs).toHaveLength(22)
  })
})