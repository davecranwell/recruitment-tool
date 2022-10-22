import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UserRolesOfUserService } from './user-roles-of-user.service'
import { CreateUserRolesOfUserDto } from './dto/create-user-roles-of-user.dto'
import { UpdateUserRolesOfUserDto } from './dto/update-user-roles-of-user.dto'

@Controller('user-roles-of-user')
export class UserRolesOfUserController {
  constructor(private readonly userRolesOfUserService: UserRolesOfUserService) {}

  @Post()
  create(@Body() createUserRolesOfUserDto: CreateUserRolesOfUserDto) {
    return this.userRolesOfUserService.create(createUserRolesOfUserDto)
  }

  @Get()
  findAll() {
    return this.userRolesOfUserService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolesOfUserService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRolesOfUserDto: UpdateUserRolesOfUserDto) {
    return this.userRolesOfUserService.update(+id, updateUserRolesOfUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userRolesOfUserService.remove(+id)
  }
}
