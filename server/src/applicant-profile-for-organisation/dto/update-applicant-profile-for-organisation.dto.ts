import { PartialType } from '@nestjs/swagger'
import { CreateApplicantProfileForOrganisationDto } from './create-applicant-profile-for-organisation.dto'

export class UpdateApplicantProfileForOrganisationDto extends PartialType(CreateApplicantProfileForOrganisationDto) {}
