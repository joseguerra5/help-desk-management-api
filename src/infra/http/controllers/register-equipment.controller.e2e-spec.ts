import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { ManagerFactory } from 'test/factories/make-manager';

describe("Create Equipment (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[POST] /equipments", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const response = await request(app.getHttpServer())
      .post("/equipments")
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: "BLM",
        name: "PC00123",
        serialNumber: "123123123"
      })

    expect(response.statusCode).toBe(201)

    const equipmentOnDatabase = await prisma.equipment.findFirst({
      where: {
        serialNumber: "123123123"
      }
    })

    expect(equipmentOnDatabase).toBeTruthy()
  })
})