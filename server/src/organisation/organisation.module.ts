import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { OrganisationService } from './organisation.service'
import { OrganisationController } from './organisation.controller'
import { OrganisationPermissions } from './organisation.permissions'

@Module({
  imports: [PrismaModule],
  controllers: [OrganisationController],
  providers: [OrganisationService, OrganisationPermissions],
  exports: [OrganisationService, OrganisationPermissions],
})
export class OrganisationModule {}
