import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { ExecutionContext, INestApplication } from '@nestjs/common'

import { OrganisationModule } from './organisation.module'
import { CaslModule } from 'src/casl/casl.module'
import { OrganisationService } from './organisation.service'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaModule } from 'src/prisma/prisma.module'

describe('Organisation', () => {
  let app: INestApplication
  let organisationService = {
    findOne: () => ['test'],
    findUsers: () => ['users'],
    create: () => 'ok',
    findPositions: () => 'positions',
    findProjects: () => 'projects',
  }

  let jwtGuard

  let prismaService = {
    project: {
      findMany: () => [],
    },
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CaslModule, PrismaModule, OrganisationModule],
      providers: [JwtAuthenticationGuard],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .overrideProvider(OrganisationService)
      .useValue(organisationService)
      .overrideGuard(JwtAuthenticationGuard)
      .useValue(jwtGuard)
      .compile()

    jwtGuard = moduleRef.get(JwtAuthenticationGuard)

    app = moduleRef.createNestApplication()
    await app.init()
  })

  it(`/GET :id allowed if user part of the organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'read',
            subject: 'Organisation',
            conditions: { id: { $in: [1] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer()).get('/organisation/1').expect(200).expect(organisationService.findOne())
  })

  it(`/GET :id not allowed if user not part of the organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'read',
            subject: 'Organisation',
            conditions: { id: { $in: [2] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer()).get('/organisation/1').expect(403)
  })

  it(`/GET :id/users allowed if a manager of the organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'manage',
            subject: 'Organisation',
            conditions: { id: { $in: [1] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer()).get('/organisation/1/users').expect(200).expect(organisationService.findUsers())
  })

  it(`/GET :id/users not allowed if not manager of the same organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'manage',
            subject: 'Organisation',
            conditions: { id: { $in: [2] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer()).get('/organisation/1/users').expect(403)
  })

  it(`/POST not allowed without create ability`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [],
      }
      return true
    })

    return request(app.getHttpServer()).post('/organisation').send({ name: 'john' }).expect(403)
  })

  it(`/POST allowed with create ability`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'create',
            subject: 'Organisation',
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer()).post('/organisation').send({ name: 'john' }).expect(201)
  })

  it(`/GET :id/positions allowed if a manager of the organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'manage',
            subject: 'Organisation',
            conditions: { id: { $in: [1] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer())
      .get('/organisation/1/positions')
      .expect(200)
      .expect(organisationService.findPositions())
  })

  it(`/GET :id/positions allowed if a member of the organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'read',
            subject: 'Organisation',
            conditions: { id: { $in: [1] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer())
      .get('/organisation/1/positions')
      .expect(200)
      .expect(organisationService.findPositions())
  })

  it(`/GET :id/projects allowed if a member of the organisation`, () => {
    jest.spyOn(jwtGuard, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest()
      req.user = {
        abilities: [
          {
            action: 'read',
            subject: 'Organisation',
            conditions: { id: { $in: [1] } },
          },
        ],
      }
      return true
    })

    return request(app.getHttpServer())
      .get('/organisation/1/projects')
      .expect(200)
      .expect(organisationService.findProjects())
  })

  afterAll(async () => {
    await app.close()
  })
})
