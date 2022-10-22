import { Test, TestingModule } from '@nestjs/testing'
import { UsersInOrganisationService } from './users-in-organisation.service'

describe('UsersInOrganisationService', () => {
  let service: UsersInOrganisationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInOrganisationService],
    }).compile()

    service = module.get<UsersInOrganisationService>(UsersInOrganisationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
