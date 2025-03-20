import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ManagerFactory } from 'test/factories/make-manager'


describe('Upload attachments (E2E)', () => {
  let app: INestApplication
  let managerFactory: ManagerFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ManagerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    managerFactory = moduleRef.get(ManagerFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })
  test('[POST] /attachments', async () => {
    const user = await managerFactory.makePrismaManager()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.pdf')


    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    })
  })
})
