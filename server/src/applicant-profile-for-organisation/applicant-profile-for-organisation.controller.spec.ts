import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantProfileForOrganisationController } from './applicant-profile-for-organisation.controller';
import { ApplicantProfileForOrganisationService } from './applicant-profile-for-organisation.service';

describe('ApplicantProfileForOrganisationController', () => {
  let controller: ApplicantProfileForOrganisationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantProfileForOrganisationController],
      providers: [ApplicantProfileForOrganisationService],
    }).compile();

    controller = module.get<ApplicantProfileForOrganisationController>(ApplicantProfileForOrganisationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
