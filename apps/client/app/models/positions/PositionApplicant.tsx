import type { ApplicantProfile } from '../applicant-profiles/ApplicantProfile'

export type PositionApplicant = ApplicantProfile & {
  user: {
    name: string
    email: string
    id: number
  }
}
