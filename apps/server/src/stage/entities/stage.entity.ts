import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { StagesInPipeline } from 'src/stages-in-pipeline/entities/stages-in-pipeline.entity'

export class Stage {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  pipeline?: StagesInPipeline[]
  applicants?: ApplicantProfileForPosition[]
}
