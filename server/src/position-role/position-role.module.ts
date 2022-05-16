import { Module } from '@nestjs/common';
import { PositionRoleService } from './position-role.service';
import { PositionRoleController } from './position-role.controller';

@Module({
  controllers: [PositionRoleController],
  providers: [PositionRoleService]
})
export class PositionRoleModule {}
