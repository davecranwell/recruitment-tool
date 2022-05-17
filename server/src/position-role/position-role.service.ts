import { Injectable } from '@nestjs/common'
import { CreatePositionRoleDto } from './dto/create-position-role.dto'
import { UpdatePositionRoleDto } from './dto/update-position-role.dto'

@Injectable()
export class PositionRoleService {
  create(createPositionRoleDto: CreatePositionRoleDto) {
    return 'This action adds a new positionRole'
  }

  findAll() {
    return `This action returns all positionRole`
  }

  findOne(id: number) {
    return `This action returns a #${id} positionRole`
  }

  update(id: number, updatePositionRoleDto: UpdatePositionRoleDto) {
    return `This action updates a #${id} positionRole`
  }

  remove(id: number) {
    return `This action removes a #${id} positionRole`
  }
}
