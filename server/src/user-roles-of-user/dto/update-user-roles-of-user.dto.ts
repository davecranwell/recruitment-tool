import { PartialType } from '@nestjs/swagger'
import { CreateUserRolesOfUserDto } from './create-user-roles-of-user.dto'

export class UpdateUserRolesOfUserDto extends PartialType(CreateUserRolesOfUserDto) {}
