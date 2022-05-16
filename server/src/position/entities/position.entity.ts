import { ApiProperty } from '@nestjs/swagger'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'
import { Position as PositionModel } from '@prisma/client'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { PositionUserRole } from 'src/position-user-role/entities/position-user-role.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'

export class Position implements PositionModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  openingDate: Date | null

  @ApiProperty()
  closingDate: Date | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  organisationId: number

  @ValidateNested()
  @Type(() => Organisation)
  organisation?: Organisation

  @ValidateNested()
  @Type(() => ApplicantProfile)
  applicantProfiles?: ApplicantProfileForPosition[]

  @ValidateNested()
  @Type(() => PositionUserRole)
  userRoles?: PositionUserRole[]

  constructor(partial: Partial<Organisation>) {
    Object.assign(this, partial)
  }
}
