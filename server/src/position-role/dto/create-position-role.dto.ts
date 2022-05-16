import { PositionRoleType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePositionRoleDto {
  name: string

  @ApiProperty({ enum: PositionRoleType })
  type: PositionRoleType
}
