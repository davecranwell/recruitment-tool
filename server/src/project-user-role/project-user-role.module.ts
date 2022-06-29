import { Module } from '@nestjs/common'
import { ProjectUserRoleService } from './project-user-role.service'
import { ProjectUserRoleController } from './project-user-role.controller'

@Module({
  controllers: [ProjectUserRoleController],
  providers: [ProjectUserRoleService],
})
export class PositionUserRoleModule {}
