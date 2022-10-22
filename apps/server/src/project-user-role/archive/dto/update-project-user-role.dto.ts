import { PartialType } from '@nestjs/swagger'
import { CreateProjectUserRoleDto } from './create-project-user-role.dto'

export class UpdateProjectUserRoleDto extends PartialType(CreateProjectUserRoleDto) {}
