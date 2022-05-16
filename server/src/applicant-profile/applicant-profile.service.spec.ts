import { Test, TestingModule } from '@nestjs/testing'
import { ApplicantProfileService } from './applicant-profile.service'

describe('ApplicantProfileService', () => {
  let service: ApplicantProfileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantProfileService],
    }).compile()

    service = module.get<ApplicantProfileService>(ApplicantProfileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
