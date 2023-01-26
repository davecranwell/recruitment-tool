import { ApiProperty } from '@nestjs/swagger'
import { Organisation as OrganisationModel } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { Position } from 'src/position/entities/position.entity'
import { UserRole } from 'src/user-role/entities/user-role.entity'
import { ApplicantProfileForOrganisation } from 'src/applicant-profile-for-organisation/entities/applicant-profile-for-organisation.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'

export class Organisation implements OrganisationModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  machineName: string

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  @ValidateNested()
  @ApiProperty({ type: () => UsersInOrganisation })
  @Type(() => UsersInOrganisation)
  users?: UsersInOrganisation[]

  @ValidateNested()
  @Type(() => Position)
  positions?: Position[]

  @ValidateNested()
  @Type(() => UserRole)
  roles?: UserRole[]

  @ValidateNested()
  @Type(() => ApplicantProfile)
  applicantProfiles?: ApplicantProfileForOrganisation[]

  constructor(partial: Partial<Organisation>) {
    Object.assign(this, partial)
  }
}
