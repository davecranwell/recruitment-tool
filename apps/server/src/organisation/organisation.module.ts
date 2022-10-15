import { Module } from '@nestjs/common'

import { OrganisationService } from './organisation.service'
import { OrganisationController } from './organisation.controller'

@Module({
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService],
})
export class OrganisationModule {}
