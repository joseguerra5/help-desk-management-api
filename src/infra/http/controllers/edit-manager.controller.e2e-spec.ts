import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest'
import { ManagerFactory } from 'test/factories/make-manager';

describe("Edit manager (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[PUT] /cooperator/:cooperatorId/inventory", async () => {
    const user = await managerFactory.makePrismaManager({
      password: await hash("123123", 8)
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/accounts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: "jhon Doe",
        userName: "DoeJ",
        employeeId: "123123",
        email: "jhondoe@email.com",
        password: "123123"
      })

    expect(response.statusCode).toBe(201)
  })
})