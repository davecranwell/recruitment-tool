import { UserRoleType } from '@prisma/client'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { UserRolesOfUser } from 'src/user-roles-of-user/entities/user-roles-of-user.entity'

export class UserRole {
  id: number
  name: string
  type: UserRoleType
  organisation?: Organisation
  organisationId: number
  createdAt: Date
  updatedAt: Date
  users?: UserRolesOfUser[]
}
