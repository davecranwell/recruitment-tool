import { Test, TestingModule } from '@nestjs/testing'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { PrismaService } from 'src/prisma/prisma.service'
import { OrganisationService } from './organisation.service'

describe('OrganisationService', () => {
  let service: OrganisationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganisationService, PrismaService, CaslPermissions],
    }).compile()

    service = module.get<OrganisationService>(OrganisationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
