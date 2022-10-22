import { PartialType, ApiProperty } from '@nestjs/swagger'
import { UserRoleType } from '@prisma/client'

import { CreateUserRoleDto } from './create-user-role.dto'

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
  name?: string
  @ApiProperty({ enum: UserRoleType })
  type?: UserRoleType
}
