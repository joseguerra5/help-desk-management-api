import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CooperatorFactory } from 'test/factories/make-cooperator'
import { CooperatorEquipmentFactory } from 'test/factories/make-cooperator-equipment'
import { EquipmentFactory } from 'test/factories/make-equipment'
import { ManagerFactory } from 'test/factories/make-manager'

import { waitFor } from 'test/util/wait-for'

describe('On cooperator exit (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let cooperatorFactory: CooperatorFactory
  let equipmentFactory: EquipmentFactory
  let cooperatorequipmentFactory: CooperatorEquipmentFactory
  let managerFactory: ManagerFactory


  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CooperatorFactory, EquipmentFactory, ManagerFactory, CooperatorEquipmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    cooperatorFactory = moduleRef.get(CooperatorFactory)
    equipmentFactory = moduleRef.get(EquipmentFactory)
    managerFactory = moduleRef.get(ManagerFactory)
    cooperatorequipmentFactory = moduleRef.get(CooperatorEquipmentFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  it('should send a notification when answer is created', async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const cooperator = await cooperatorFactory.makePrismaCooperator()
    const equipment = await equipmentFactory.makePrismaEquipment()
    const equipment2 = await equipmentFactory.makePrismaEquipment()

    await cooperatorequipmentFactory.makePrismaCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment.id,
    })

    await cooperatorequipmentFactory.makePrismaCooperatorEquipment({
      cooperatorId: cooperator.id,
      equipmentId: equipment2.id,
    })


    const departureDate = new Date(Date.now() + 5000)

    await request(app.getHttpServer())
      .put(`/cooperator/${cooperator.id.toString()}/departure`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        departureDate,
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString()
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
