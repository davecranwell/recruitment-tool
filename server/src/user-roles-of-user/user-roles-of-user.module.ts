import { Module } from '@nestjs/common'
import { UserRolesOfUserService } from './user-roles-of-user.service'
import { UserRolesOfUserController } from './user-roles-of-user.controller'

@Module({
  controllers: [UserRolesOfUserController],
  providers: [UserRolesOfUserService],
})
export class UserRolesOfUserModule {}
