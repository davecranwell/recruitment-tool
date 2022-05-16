import { Injectable } from '@nestjs/common';
import { CreateUserRolesOfUserDto } from './dto/create-user-roles-of-user.dto';
import { UpdateUserRolesOfUserDto } from './dto/update-user-roles-of-user.dto';

@Injectable()
export class UserRolesOfUserService {
  create(createUserRolesOfUserDto: CreateUserRolesOfUserDto) {
    return 'This action adds a new userRolesOfUser';
  }

  findAll() {
    return `This action returns all userRolesOfUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRolesOfUser`;
  }

  update(id: number, updateUserRolesOfUserDto: UpdateUserRolesOfUserDto) {
    return `This action updates a #${id} userRolesOfUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRolesOfUser`;
  }
}
