import { Position } from 'src/position/entities/position.entity'
import { UserEntity as User } from 'src/user/entities/user.entity'
import { PositionRole } from 'src/position-role/entities/position-role.entity'

export class PositionUserRole {
  position?: Position
  positionId: number
  user?: User
  userId: number
  role?: PositionRole
  roleId: number
  createdAt: Date
  updatedAt: Date
}
