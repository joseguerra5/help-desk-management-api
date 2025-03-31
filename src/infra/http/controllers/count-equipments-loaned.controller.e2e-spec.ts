import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CooperatorFactory } from 'test/factories/make-cooperator';
import { CooperatorEquipmentFactory } from 'test/factories/make-cooperator-equipment';
import { EquipmentFactory } from 'test/factories/make-equipment';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Fetch Equipments (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let equipmentFactory: EquipmentFactory
  let cooperatorEquipmentFactory: CooperatorEquipmentFactory
  let cooperatorFactory: CooperatorFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, EquipmentFactory, CooperatorFactory, CooperatorEquipmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    cooperatorEquipmentFactory = moduleRef.get(CooperatorEquipmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /equipments", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const cooperator = await cooperatorFactory.makePrismaCooperator()

    for (let i = 1; i <= 22; i++) {
      const equipment = await equipmentFactory.makePrismaEquipment(
        { createdAt: new Date(2024, 11, i), },
      );

      await cooperatorEquipmentFactory.makePrismaCooperatorEquipment({
        cooperatorId: cooperator.id,
        equipmentId: equipment.id
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/metrics/equipments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.currentLoanedAmount).toEqual(22)
    expect(response.body.totalAmount).toEqual(22)
  })
})