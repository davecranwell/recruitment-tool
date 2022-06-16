import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'
import { CaslModule } from 'src/casl/casl.module'

import { OrganisationService } from './organisation.service'
import { OrganisationController } from './organisation.controller'
import { OrganisationPermissions } from './organisation.permissions'

@Module({
  controllers: [OrganisationController],
  providers: [OrganisationService, OrganisationPermissions],
  exports: [OrganisationService, OrganisationPermissions],
})
export class OrganisationModule {}
