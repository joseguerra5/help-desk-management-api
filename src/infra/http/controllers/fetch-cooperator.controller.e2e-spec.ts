import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Fetch Cooperators (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let cooperatorFactory: CooperatorFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /cooperator", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    for (let i = 1; i <= 22; i++) {
      await cooperatorFactory.makePrismaCooperator(
        { createdAt: new Date(2024, 11, i) },
      );
    }

    const response = await request(app.getHttpServer())
      .get(`/cooperator?page=2`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.cooperators).toHaveLength(2)
  })
})