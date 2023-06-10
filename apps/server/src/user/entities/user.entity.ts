import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { ProjectUserRole } from 'src/project-user-role/entities/project-user-role.entity'
import { UserRolesOfUser } from 'src/user-roles-of-user/entities/user-roles-of-user.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'

export class UserEntity implements User {
  @ApiProperty({ required: true })
  id: number

  @ApiProperty({ required: true })
  email: string

  @ApiProperty({ required: true })
  name: string | null

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  @ApiProperty()
  abilities?: any

  @ApiProperty()
  avatarUrl: string

  @Exclude()
  canCreateOrgs: boolean

  @Exclude()
  maxOrgs: number

  @Exclude()
  password: string

  @Exclude()
  refreshTokenHash: string

  @Exclude()
  OAuth2Tokens: any

  @Exclude()
  isRegisteredWithGoogle: boolean

  accessToken?: string
  refreshToken?: string

  @ApiProperty({ type: () => UsersInOrganisation, isArray: true })
  @ValidateNested()
  @Type(() => UsersInOrganisation)
  organisations?: UsersInOrganisation[]
  userRoles?: UserRolesOfUser[]
  projectRoles?: ProjectUserRole[]
  applicantProfiles?: ApplicantProfile[]

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
