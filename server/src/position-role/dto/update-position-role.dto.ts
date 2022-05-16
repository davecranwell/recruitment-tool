import { PartialType, ApiProperty } from '@nestjs/swagger'
import { PositionRoleType } from '@prisma/client'

import { CreatePositionRoleDto } from './create-position-role.dto'

export class UpdatePositionRoleDto extends PartialType(CreatePositionRoleDto) {
  name?: string

  @ApiProperty({ enum: PositionRoleType })
  type?: PositionRoleType
}
