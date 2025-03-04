import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { EquipmentFactory } from 'test/factories/make-equipment';
import { ManagerFactory } from 'test/factories/make-manager';

describe("Fetch Equipments (E2E)", () => {
  let app: INestApplication;
  let managerFactory: ManagerFactory
  let equipmentFactory: EquipmentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, EquipmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    managerFactory = moduleRef.get(ManagerFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    jwt = moduleRef.get(JwtService)
    await app.init();
  });
  test("[GET] /equipments", async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    for (let i = 1; i <= 22; i++) {
      await equipmentFactory.makePrismaEquipment(
        { createdAt: new Date(2024, 11, i) },
      );
    }

    const response = await request(app.getHttpServer())
      .get(`/equipments?page=2`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.equipments).toHaveLength(2)
  })
})