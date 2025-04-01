import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Get cooperator by ID (E2E)", () => {
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
  test("[GET] /cooperator/:cooperatorId", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    const response = await request(app.getHttpServer())
      .get(`/cooperator/${cooperator.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
  })
})