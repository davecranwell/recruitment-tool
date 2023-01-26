import { ApiProperty } from '@nestjs/swagger'
import { ApplicantProfile as ApplicantProfileModel } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Expose, Type } from 'class-transformer'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { Position } from 'src/position/entities/position.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'

import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { ApplicantProfileForOrganisation } from 'src/applicant-profile-for-organisation/entities/applicant-profile-for-organisation.entity'

export class ApplicantProfile implements ApplicantProfileModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  profileName: string

  @ApiProperty()
  @Expose({ groups: ['manage', 'review'] })
  askingSalary: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  userId: number

  @ValidateNested()
  @Type(() => User)
  user?: User

  @ValidateNested()
  @Type(() => Position)
  positions?: ApplicantProfileForPosition[]

  @ValidateNested()
  @Type(() => Organisation)
  organisations?: ApplicantProfileForOrganisation[]

  constructor(partial: Partial<ApplicantProfile>) {
    Object.assign(this, partial)
  }
}

export class ApplicantProfileWithUser extends ApplicantProfile {
  @ApiProperty({ type: () => User })
  @ValidateNested()
  @Type(() => User)
  user: User
}
