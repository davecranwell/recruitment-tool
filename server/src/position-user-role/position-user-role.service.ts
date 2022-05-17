import { Injectable } from '@nestjs/common'
import { CreatePositionUserRoleDto } from './dto/create-position-user-role.dto'
import { UpdatePositionUserRoleDto } from './dto/update-position-user-role.dto'

@Injectable()
export class PositionUserRoleService {
  create(createPositionUserRoleDto: CreatePositionUserRoleDto) {
    return 'This action adds a new positionUserRole'
  }

  findAll() {
    return `This action returns all positionUserRole`
  }

  findOne(id: number) {
    return `This action returns a #${id} positionUserRole`
  }

  update(id: number, updatePositionUserRoleDto: UpdatePositionUserRoleDto) {
    return `This action updates a #${id} positionUserRole`
  }

  remove(id: number) {
    return `This action removes a #${id} positionUserRole`
  }
}
