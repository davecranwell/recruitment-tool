import { Test, TestingModule } from '@nestjs/testing'
import { ApplicantProfileForPositionService } from './applicant-profile-for-position.service'

describe('ApplicantProfileForPositionService', () => {
  let service: ApplicantProfileForPositionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantProfileForPositionService],
    }).compile()

    service = module.get<ApplicantProfileForPositionService>(ApplicantProfileForPositionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
