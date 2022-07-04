import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { ApplicantProfileService } from './applicant-profile.service'

describe('ApplicantProfileService', () => {
  let service: ApplicantProfileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantProfileService, PrismaService, UserService],
    }).compile()

    service = module.get<ApplicantProfileService>(ApplicantProfileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
