import { ApiProperty } from '@nestjs/swagger'
import { UserRoleType, UsersInOrganisation as UsersInOrganisationModel, User as PrismaUser } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'

export class UsersInOrganisation implements UsersInOrganisationModel {
  @ApiProperty({ type: () => User })
  @ValidateNested()
  @Type(() => User)
  user?: User

  @ApiProperty()
  role: UserRoleType

  @ApiProperty()
  userId: number

  organisation?: Organisation

  @ApiProperty()
  organisationId: number

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  constructor(partial: Partial<UsersInOrganisation>) {
    Object.assign(this, partial)
  }
}

export class UsersInOrganisationIdonly {
  organisationId: number
}
