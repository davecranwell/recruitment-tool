import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Position } from 'src/position/entities/position.entity'

export class ApplicantProfileForPosition {
  applicantProfile?: ApplicantProfile
  applicantProfileId: number
  position?: Position
  positionId: number
  createdAt: Date
  updatedAt: Date
}
