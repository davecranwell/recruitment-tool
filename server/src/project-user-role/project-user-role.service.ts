import { Injectable } from '@nestjs/common'
import { CreateProjectUserRoleDto } from './dto/create-project-user-role.dto'
import { UpdateProjectUserRoleDto } from './dto/update-project-user-role.dto'

@Injectable()
export class ProjectUserRoleService {
  create(createProjectUserRoleDto: CreateProjectUserRoleDto) {
    return 'This action adds a new projectUserRole'
  }

  findAll() {
    return `This action returns all projectUserRole`
  }

  findOne(id: number) {
    return `This action returns a #${id} projectUserRole`
  }

  update(id: number, updateProjectUserRoleDto: UpdateProjectUserRoleDto) {
    return `This action updates a #${id} projectUserRole`
  }

  remove(id: number) {
    return `This action removes a #${id} projectUserRole`
  }
}
