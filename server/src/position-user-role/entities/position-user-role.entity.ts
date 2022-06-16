import { PositionRoleType, PositionUserRole as PositionUserRoleModel } from '@prisma/client'

import { Position } from 'src/position/entities/position.entity'
import { UserEntity as User } from 'src/user/entities/user.entity'

export class PositionUserRole implements PositionUserRoleModel {
  position?: Position
  positionId: number
  user?: User
  userId: number
  role: PositionRoleType
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<PositionUserRole>) {
    Object.assign(this, partial)
  }
}
