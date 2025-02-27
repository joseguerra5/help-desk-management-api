import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Edit Cooperator Inventory (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let cooperatorFactory: CooperatorFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    prisma = moduleRef.get(PrismaService)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[PUT] /cooperator/:cooperatorId/departure", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    const response = await request(app.getHttpServer())
      .put(`/cooperator/${cooperator.id.toString()}/departure`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        departureDate: new Date(),
      })

    expect(response.statusCode).toBe(201)

    const cooperatorOnDatabase = await prisma.cooperator.findFirst({
      where: {
        id: cooperator.id.toString()
      }
    })
    expect(cooperatorOnDatabase?.departureDate).toBeTruthy()
  })
})