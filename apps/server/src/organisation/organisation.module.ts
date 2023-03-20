import { Module } from '@nestjs/common'

import { OrganisationService } from './organisation.service'
import { OrganisationController } from './organisation.controller'
import { ProjectModule } from 'src/project/project.module'
import { FileServiceModule } from '~/file-service/file-service.module'

@Module({
  imports: [ProjectModule, FileServiceModule],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService],
})
export class OrganisationModule {}
