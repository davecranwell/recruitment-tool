import { PartialType } from '@nestjs/swagger'
import { CreatePositionUserRoleDto } from './create-position-user-role.dto'

export class UpdatePositionUserRoleDto extends PartialType(CreatePositionUserRoleDto) {}
