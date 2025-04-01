import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { EquipmentFactory } from 'test/factories/make-equipment';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Edit Cooperator Inventory (E2E)", () => {
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
    prisma = moduleRef.get(PrismaService)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[PUT] /equipments/:equipmentId/damage", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true })

    const equipment = await equipmentFactory.makePrismaEquipment()

    const response = await request(app.getHttpServer())
      .put(`/equipments/${equipment.id.toString()}/damage`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        reason: "teste",
        brokenAt: new Date(),
      })

    expect(response.statusCode).toBe(201)

    const equipmentsOnDatabase = await prisma.equipment.findFirst({
      where: {
        id: equipment.id.toString()
      }
    })

    expect(equipmentsOnDatabase?.brokenAt).toBeTruthy()
  })
})