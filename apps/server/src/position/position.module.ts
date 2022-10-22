import { Module } from '@nestjs/common'

import { OrganisationModule } from 'src/organisation/organisation.module'

import { PositionController } from './position.controller'
import { PositionService } from './position.service'

@Module({
  imports: [OrganisationModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
