import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Assessment as AssessmentModel, AssessmentType, ScoringSystemType } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { Interview } from 'src/interview/entities/interview.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Position } from 'src/position/entities/position.entity'

export class Assessment implements AssessmentModel {
  @ApiProperty()
  id: number

  name: string | null

  @ApiProperty()
  userId: number

  @ApiProperty()
  score: number | null

  @ApiProperty()
  applicantProfileId: number

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  @ApiProperty()
  positionId: number

  @ApiProperty()
  interviewId: number | null

  @ApiProperty()
  notes: string | null

  @ApiProperty()
  scoringSystemId: number

  @ValidateNested()
  @Type(() => Interview)
  interview?: Interview | null

  @ValidateNested()
  @Type(() => ApplicantProfile)
  applicantProfile?: ApplicantProfile

  @ValidateNested()
  @Type(() => Position)
  position?: Position

  type: AssessmentType

  scoringSystem?: ScoringSystemType

  constructor(partial: Partial<Assessment>) {
    Object.assign(this, partial)
  }
}
