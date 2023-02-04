import { Module } from '@nestjs/common'

import { OrganisationService } from './organisation.service'
import { OrganisationController } from './organisation.controller'
import { ProjectModule } from 'src/project/project.module'

@Module({
  imports: [ProjectModule],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService],
})
export class OrganisationModule {}
