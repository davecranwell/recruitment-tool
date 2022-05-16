import { PositionRoleType } from '@prisma/client'

import { PositionUserRole } from 'src/position-user-role/entities/position-user-role.entity'

export class PositionRole {
  id: number
  name: string
  type: PositionRoleType
  createdAt: Date
  updatedAt: Date
  userPosition?: PositionUserRole[]
}
