import { UserRoleType } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'

export class UsersInOrganisation {
  @ValidateNested()
  @Type(() => User)
  user?: User
  role: UserRoleType
  userId: number
  organisation?: Organisation
  organisationId: number
  createdAt: Date
  updatedAt: Date
}
