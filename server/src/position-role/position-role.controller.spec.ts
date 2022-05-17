import { Test, TestingModule } from '@nestjs/testing'
import { PositionRoleController } from './position-role.controller'
import { PositionRoleService } from './position-role.service'

describe('PositionRoleController', () => {
  let controller: PositionRoleController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionRoleController],
      providers: [PositionRoleService],
    }).compile()

    controller = module.get<PositionRoleController>(PositionRoleController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
