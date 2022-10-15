import { Organisation } from 'src/organisation/entities/organisation.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'

export class ApplicantProfileForOrganisation {
  applicantProfile?: ApplicantProfile
  applicantProfileId: number
  organisation?: Organisation
  organisationId: number
  createdAt: Date
  updatedAt: Date
}
