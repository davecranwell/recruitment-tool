import { Test, TestingModule } from '@nestjs/testing'
import { UserRolesOfUserController } from './user-roles-of-user.controller'
import { UserRolesOfUserService } from './user-roles-of-user.service'

describe('UserRolesOfUserController', () => {
  let controller: UserRolesOfUserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesOfUserController],
      providers: [UserRolesOfUserService],
    }).compile()

    controller = module.get<UserRolesOfUserController>(UserRolesOfUserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
