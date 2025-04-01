import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest'
import { ManagerFactory } from 'test/factories/make-manager';

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    await app.init();
  });
  test("[POST] /session", async () => {
    await managerFactory.makePrismaManager({
      email: "jhondoe@example.com",
      password: await hash("12345678", 8),
      isTwoFactorAuthenticationEnabled: true
    })

    const response = await request(app.getHttpServer()).post("/session").send({
      email: "jhondoe@example.com",
      password: "12345678",
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})