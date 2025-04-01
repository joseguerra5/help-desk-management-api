import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest'
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { EquipmentFactory } from 'test/factories/make-equipment';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Edit Cooperator Inventory (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let cooperatorFactory: CooperatorFactory
  let equipmentFactory: EquipmentFactory
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, CooperatorFactory, EquipmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    prisma = moduleRef.get(PrismaService)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[PUT] /cooperator/:cooperatorId/inventory", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    const equipment1 = await equipmentFactory.makePrismaEquipment()
    const equipment2 = await equipmentFactory.makePrismaEquipment()


    const response = await request(app.getHttpServer())
      .put(`/cooperator/${cooperator.id.toString()}/inventory`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        equipmentsIds: [equipment1.id.toString(), equipment2.id.toString()]
      })

    expect(response.statusCode).toBe(201)

    const equipmentsOnDatabase = await prisma.equipment.findMany({
      where: {
        cooperatorId: cooperator.id.toString()
      }
    })

    expect(equipmentsOnDatabase).toHaveLength(2)

    const loanRecordOnDatabase = await prisma.loanRecord.findMany({
      where: {
        cooperatorId: cooperator.id.toString()
      }
    })

    expect(loanRecordOnDatabase).toHaveLength(1)

  })
})