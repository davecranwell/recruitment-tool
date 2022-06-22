import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { StagesInPipeline } from 'src/stages-in-pipeline/entities/stages-in-pipeline.entity'

export class Stage {
  id: number
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  pipeline?: StagesInPipeline[]
  applicants?: ApplicantProfileForPosition[]
}
