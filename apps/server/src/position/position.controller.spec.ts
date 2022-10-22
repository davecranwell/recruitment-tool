import { Test, TestingModule } from '@nestjs/testing'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { PrismaService } from 'src/prisma/prisma.service'
import { PositionController } from './position.controller'
import { PositionService } from './position.service'

describe('PositionController', () => {
  let controller: PositionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [PositionService, PrismaService, CaslPermissions],
    }).compile()

    controller = module.get<PositionController>(PositionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
