import { Test, TestingModule } from '@nestjs/testing'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { ApplicantProfileController } from './applicant-profile.controller'
import { ApplicantProfileService } from './applicant-profile.service'

describe('ApplicantProfileController', () => {
  let controller: ApplicantProfileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantProfileController],
      providers: [ApplicantProfileService, PrismaService, UserService, CaslPermissions],
    }).compile()

    controller = module.get<ApplicantProfileController>(ApplicantProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
