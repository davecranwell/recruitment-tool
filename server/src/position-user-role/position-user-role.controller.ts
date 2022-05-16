import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionUserRoleService } from './position-user-role.service';
import { CreatePositionUserRoleDto } from './dto/create-position-user-role.dto';
import { UpdatePositionUserRoleDto } from './dto/update-position-user-role.dto';

@Controller('position-user-role')
export class PositionUserRoleController {
  constructor(private readonly positionUserRoleService: PositionUserRoleService) {}

  @Post()
  create(@Body() createPositionUserRoleDto: CreatePositionUserRoleDto) {
    return this.positionUserRoleService.create(createPositionUserRoleDto);
  }

  @Get()
  findAll() {
    return this.positionUserRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionUserRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePositionUserRoleDto: UpdatePositionUserRoleDto) {
    return this.positionUserRoleService.update(+id, updatePositionUserRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionUserRoleService.remove(+id);
  }
}
