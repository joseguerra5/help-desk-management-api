import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Get qr url to 2fa enable (E2E)", () => {
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
  test("[GET] /2fa/qr_code", async () => {
    const user = await managerFactory.makePrismaManager({
      isTwoFactorAuthenticationEnabled: false
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: false })


    const response = await request(app.getHttpServer())
      .get(`/2fa/qr_code`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body)
    expect(response.statusCode).toBe(200)

  })
})