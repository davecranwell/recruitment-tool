import { ApiProperty } from '@nestjs/swagger'
import { UserRoleType, UsersInOrganisation as UsersInOrganisationModel } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { UserEntity } from 'src/user/entities/user.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'

export class UsersInOrganisation implements UsersInOrganisationModel {
  @ValidateNested()
  @ApiProperty({ type: () => UserEntity })
  @Type(() => UserEntity)
  user?: UserEntity

  @ApiProperty({ enum: UserRoleType })
  role: UserRoleType

  @ApiProperty()
  userId: number

  @ValidateNested()
  @ApiProperty({ type: () => Organisation })
  @Type(() => Organisation)
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
