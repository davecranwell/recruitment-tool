import { UserEntity } from 'src/user/entities/user.entity'
import { UserRole } from 'src/user-role/entities/user-role.entity'

export class UserRolesOfUser {
  user?: UserEntity
  userId: number
  role?: UserRole
  roleId: number
  createdAt: Date
  updatedAt: Date
}
