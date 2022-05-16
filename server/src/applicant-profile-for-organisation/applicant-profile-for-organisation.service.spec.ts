import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantProfileForOrganisationService } from './applicant-profile-for-organisation.service';

describe('ApplicantProfileForOrganisationService', () => {
  let service: ApplicantProfileForOrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantProfileForOrganisationService],
    }).compile();

    service = module.get<ApplicantProfileForOrganisationService>(ApplicantProfileForOrganisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
