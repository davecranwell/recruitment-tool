import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
  Interview as InterviewModel,
  InterviewAttendee as InterviewAttendeeModel,
  ScoringSystem as ScoringSystemModel,
  ScoringSystemType,
} from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { ApplicantProfile, ApplicantProfileWithUser } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Position } from 'src/position/entities/position.entity'
import { Stage } from 'src/stage/entities/stage.entity'
import { UserEntity as User } from 'src/user/entities/user.entity'
import { Assessment } from 'src/assessment/entities/assessment.entity'

export class ScoringSystem implements ScoringSystemModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  type: ScoringSystemType | null

  @ApiProperty()
  schema: any

  createdAt: Date
  updatedAt: Date
  Interview?: Interview[]
}

export class InterviewAttendee implements InterviewAttendeeModel {
  @ApiProperty()
  interviewId: number

  @ApiProperty()
  userId: number

  @ApiProperty()
  interview?: InterviewModel

  @ValidateNested()
  @Type(() => User)
  user?: User

  notes: string
  score: number

  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<InterviewAttendee>) {
    Object.assign(this, partial)
  }
}

export class Interview implements InterviewModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  applicantProfileId: number

  @ApiProperty()
  stageId: number

  @ApiProperty()
  positionId: number

  @ApiProperty()
  startDateTime: Date

  @ApiProperty()
  endDateTime: Date

  @Exclude()
  createdAt: Date

  @ApiProperty()
  questionsId: number

  @Exclude()
  updatedAt: Date

  @ApiProperty()
  averageScore: number

  @ApiProperty()
  scoringSystemId: number

  @ValidateNested()
  @Type(() => ApplicantProfile)
  applicantProfile?: ApplicantProfile

  @ValidateNested()
  @Type(() => Position)
  position?: Position

  @ValidateNested()
  @Type(() => Stage)
  stage?: Stage

  @ValidateNested()
  @Type(() => InterviewAttendee)
  attendees?: InterviewAttendee[]

  constructor(partial: Partial<Interview>) {
    Object.assign(this, partial)
  }
}

export class InterviewWithStageScoringApplicant extends OmitType(Interview, ['applicantProfile'] as const) {
  @ApiProperty({ type: () => Stage })
  @ValidateNested()
  @Type(() => Stage)
  stage: Stage

  @ApiProperty({ type: () => ApplicantProfileWithUser })
  @ValidateNested()
  @Type(() => ApplicantProfileWithUser)
  applicantProfile: Partial<ApplicantProfileWithUser>

  @ApiProperty({ type: () => Assessment })
  @ValidateNested()
  @Type(() => Assessment)
  assessments: Assessment[]

  constructor(partial: Partial<InterviewWithStageScoringApplicant>) {
    super(partial)
    Object.assign(this, partial)
  }
}
