import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { PrismaService } from './prisma/prisma.service'
import { AppModule } from '../src/app.module'

jest.mock('src/prisma/prisma.service')

const moduleMocker = new ModuleMocker(global)

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return { findAll: jest.fn().mockResolvedValue([]) }
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>
          const Mock = moduleMocker.generateFromMetadata(mockMetadata)
          return new Mock()
        }
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404)
  })
})
