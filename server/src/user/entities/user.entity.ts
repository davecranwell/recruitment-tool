import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude, Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'

import {
  UsersInOrganisation,
  UsersInOrganisationIdonly,
} from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { UserRolesOfUser } from 'src/user-roles-of-user/entities/user-roles-of-user.entity'
import { ProjectUserRole } from 'src/project-user-role/entities/project-user-role.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'
import { Ability } from '@casl/ability'

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

  @ValidateNested()
  @Type(() => UsersInOrganisation)
  organisations?: UsersInOrganisation[]
  userRoles?: UserRolesOfUser[]
  projectRoles?: ProjectUserRole[]
  applicantProfiles?: ApplicantProfile[]

  @ApiProperty()
  abilities: any

  @ApiProperty()
  avatarUrl: string

  isRegisteredWithGoogle: boolean

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
