import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { authenticator } from 'otplib';
import request from 'supertest';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Validate 2fa (E2E)", () => {
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
  test("[POST] /2fa/enable", async () => {
    const secret = authenticator.generateSecret();
    const user = await managerFactory.makePrismaManager({
      isTwoFactorAuthenticationEnabled: true,
      twoFactorAuthenticationSecret: secret,
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: false })

    const code = authenticator.generate(secret);

    const response = await request(app.getHttpServer())
      .post(`/2fa/validate`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        code,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})