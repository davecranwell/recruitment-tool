import { UserRoleType } from '@prisma/client'
import { Exclude } from 'class-transformer'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { UserRolesOfUser } from 'src/user-roles-of-user/entities/user-roles-of-user.entity'

export class UserRole {
  id: number
  name: string
  type: UserRoleType
  organisation?: Organisation
  organisationId: number

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  users?: UserRolesOfUser[]
}
