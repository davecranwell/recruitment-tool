import { Module } from '@nestjs/common'

import { OrganisationModule } from 'src/organisation/organisation.module'

import { PositionController } from './position.controller'
import { PositionService } from './position.service'

@Module({
  imports: [OrganisationModule],
  controllers: [PositionController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
