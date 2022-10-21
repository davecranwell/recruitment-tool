import { ApiProperty } from '@nestjs/swagger'
import { Interview as InterviewModel, InterviewAttendee as InterviewAttendeeModel } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Position } from 'src/position/entities/position.entity'
import { Stage } from 'src/stage/entities/stage.entity'
import { UserEntity as User } from 'src/user/entities/user.entity'

export class InterviewAttendee implements InterviewAttendeeModel {
  @ApiProperty()
  interviewId: number

  @ApiProperty()
  userId: number

  @ApiProperty()
  interview?: Interview

  @ValidateNested()
  @Type(() => User)
  user?: User
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
