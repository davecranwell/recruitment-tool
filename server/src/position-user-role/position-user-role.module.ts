import { Module } from '@nestjs/common'
import { PositionUserRoleService } from './position-user-role.service'
import { PositionUserRoleController } from './position-user-role.controller'

@Module({
  controllers: [PositionUserRoleController],
  providers: [PositionUserRoleService],
})
export class PositionUserRoleModule {}
