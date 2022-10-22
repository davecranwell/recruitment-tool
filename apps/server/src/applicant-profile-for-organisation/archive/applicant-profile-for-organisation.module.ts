import { Module } from '@nestjs/common'
import { ApplicantProfileForOrganisationService } from './applicant-profile-for-organisation.service'
import { ApplicantProfileForOrganisationController } from './applicant-profile-for-organisation.controller'

@Module({
  controllers: [ApplicantProfileForOrganisationController],
  providers: [ApplicantProfileForOrganisationService],
})
export class ApplicantProfileForOrganisationModule {}
