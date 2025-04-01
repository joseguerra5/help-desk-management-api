import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { EquipmentFactory } from 'test/factories/make-equipment';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Create Cooperator (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let equipmentFactory: EquipmentFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, EquipmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[POST] /cooperator", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true })
    const equipment1 = await equipmentFactory.makePrismaEquipment()
    const equipment2 = await equipmentFactory.makePrismaEquipment()



    const response = await request(app.getHttpServer())
      .post("/cooperator")
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: "jhondoe@email.com",
        name: "Jhon Doe",
        userName: "DOEJ",
        employeeId: "1234",
        equipmentIds: [equipment1.id.toString(), equipment2.id.toString()],
        phone: "9191919191",
        nif: "123123123"
      })

    expect(response.statusCode).toBe(201)

    const cooperatorOnDatabase = await prisma.cooperator.findFirst({
      where: {
        email: "jhondoe@email.com"
      }
    })

    expect(cooperatorOnDatabase).toBeTruthy()


    const equipmentsOnDatabase = await prisma.equipment.findMany({
      where: {
        cooperatorId: cooperatorOnDatabase?.id
      }
    })

    expect(equipmentsOnDatabase).toHaveLength(2)

  })
})