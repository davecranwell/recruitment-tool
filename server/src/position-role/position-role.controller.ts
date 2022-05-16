import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PositionRoleService } from './position-role.service';
import { CreatePositionRoleDto } from './dto/create-position-role.dto';
import { UpdatePositionRoleDto } from './dto/update-position-role.dto';

@Controller('position-role')
export class PositionRoleController {
  constructor(private readonly positionRoleService: PositionRoleService) {}

  @Post()
  create(@Body() createPositionRoleDto: CreatePositionRoleDto) {
    return this.positionRoleService.create(createPositionRoleDto);
  }

  @Get()
  findAll() {
    return this.positionRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePositionRoleDto: UpdatePositionRoleDto) {
    return this.positionRoleService.update(+id, updatePositionRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionRoleService.remove(+id);
  }
}
