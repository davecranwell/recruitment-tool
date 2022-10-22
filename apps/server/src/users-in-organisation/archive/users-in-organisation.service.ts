import { Injectable } from '@nestjs/common'
import { CreateUsersInOrganisationDto } from './dto/create-users-in-organisation.dto'
import { UpdateUsersInOrganisationDto } from './dto/update-users-in-organisation.dto'

@Injectable()
export class UsersInOrganisationService {
  create(createUsersInOrganisationDto: CreateUsersInOrganisationDto) {
    return 'This action adds a new usersInOrganisation'
  }

  findAll() {
    return `This action returns all usersInOrganisation`
  }

  findOne(id: number) {
    return `This action returns a #${id} usersInOrganisation`
  }

  update(id: number, updateUsersInOrganisationDto: UpdateUsersInOrganisationDto) {
    return `This action updates a #${id} usersInOrganisation`
  }

  remove(id: number) {
    return `This action removes a #${id} usersInOrganisation`
  }
}
