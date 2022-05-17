import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { OrganisationService } from './organisation.service'
import { OrganisationController } from './organisation.controller'

@Module({
  imports: [PrismaModule],
  controllers: [OrganisationController],
  providers: [OrganisationService],
  exports: [OrganisationService],
})
export class OrganisationModule {}
