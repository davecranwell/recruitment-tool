import { ApiProperty } from '@nestjs/swagger'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { Position } from 'src/position/entities/position.entity'

export class Approval {
  @ApiProperty()
  positionId: number

  @ApiProperty()
  userId: number

  user?: User
  position?: Position
}
