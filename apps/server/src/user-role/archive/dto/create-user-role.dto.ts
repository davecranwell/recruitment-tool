import { UserRoleType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserRoleDto {
  name: string

  @ApiProperty({ enum: UserRoleType })
  type: UserRoleType
}
