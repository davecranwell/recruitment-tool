import { Test, TestingModule } from '@nestjs/testing'
import { UsersInOrganisationController } from './users-in-organisation.controller'
import { UsersInOrganisationService } from './users-in-organisation.service'

describe('UsersInOrganisationController', () => {
  let controller: UsersInOrganisationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersInOrganisationController],
      providers: [UsersInOrganisationService],
    }).compile()

    controller = module.get<UsersInOrganisationController>(UsersInOrganisationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
