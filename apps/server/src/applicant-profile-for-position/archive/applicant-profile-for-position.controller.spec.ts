import { Test, TestingModule } from '@nestjs/testing'
import { ApplicantProfileForPositionController } from './applicant-profile-for-position.controller'
import { ApplicantProfileForPositionService } from './applicant-profile-for-position.service'

describe('ApplicantProfileForPositionController', () => {
  let controller: ApplicantProfileForPositionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantProfileForPositionController],
      providers: [ApplicantProfileForPositionService],
    }).compile()

    controller = module.get<ApplicantProfileForPositionController>(ApplicantProfileForPositionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
