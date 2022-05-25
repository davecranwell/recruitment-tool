import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { IsOptional } from 'class-validator'

import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { UserRolesOfUser } from 'src/user-roles-of-user/entities/user-roles-of-user.entity'
import { PositionUserRole } from 'src/position-user-role/entities/position-user-role.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'

export class UserEntity implements User {
  @ApiProperty({ required: true })
  id: number

  @ApiProperty({ required: true })
  email: string

  @ApiProperty({ required: true })
  name: string | null

  @Exclude()
  password: string

  accessToken: string
  refreshToken: string

  @Exclude()
  refreshTokenHash: string

  @ApiProperty({ required: true })
  createdAt: Date

  @ApiProperty({ required: true })
  updatedAt: Date

  organisations?: UsersInOrganisation[]
  userRoles?: UserRolesOfUser[]
  positionRoles?: PositionUserRole[]
  applicantProfiles?: ApplicantProfile[]

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
