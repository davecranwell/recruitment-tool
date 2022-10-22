import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { UsersInOrganisationService } from './users-in-organisation.service'
import { CreateUsersInOrganisationDto } from './dto/create-users-in-organisation.dto'
import { UpdateUsersInOrganisationDto } from './dto/update-users-in-organisation.dto'

@Controller('users-in-organisation')
export class UsersInOrganisationController {
  constructor(private readonly usersInOrganisationService: UsersInOrganisationService) {}

  @Post()
  create(@Body() createUsersInOrganisationDto: CreateUsersInOrganisationDto) {
    return this.usersInOrganisationService.create(createUsersInOrganisationDto)
  }

  @Get()
  findAll() {
    return this.usersInOrganisationService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersInOrganisationService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersInOrganisationDto: UpdateUsersInOrganisationDto) {
    return this.usersInOrganisationService.update(+id, updateUsersInOrganisationDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersInOrganisationService.remove(+id)
  }
}
