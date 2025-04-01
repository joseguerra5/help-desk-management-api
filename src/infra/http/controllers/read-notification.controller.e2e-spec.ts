import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/make-manager'
import { NotificationFactory } from 'test/factories/make-notification'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let prisma: PrismaService
  let notificationFactory: NotificationFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory, NotificationFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    managerFactory = moduleRef.get(ManagerFactory)
    prisma = moduleRef.get(PrismaService)
    notificationFactory = moduleRef.get(NotificationFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await managerFactory.makePrismaManager({
      name: 'Jhon Doe',
    })

    const accessToken = jwt.sign({ sub: user.id.toString(), isTwoFactorAuthenticated: true, })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })



    const response = await request(app.getHttpServer())
      .patch(`/notifications/"${notification.id.toString()}"/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
