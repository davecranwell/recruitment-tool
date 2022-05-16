import { Test, TestingModule } from '@nestjs/testing'
import { ApplicantProfileController } from './applicant-profile.controller'
import { ApplicantProfileService } from './applicant-profile.service'

describe('ApplicantProfileController', () => {
  let controller: ApplicantProfileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantProfileController],
      providers: [ApplicantProfileService],
    }).compile()

    controller = module.get<ApplicantProfileController>(ApplicantProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
