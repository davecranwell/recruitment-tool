import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { OrganisationModule } from 'src/organisation/organisation.module'

import { PositionService } from './position.service'
import { PositionController } from './position.controller'

@Module({
  imports: [PrismaModule, OrganisationModule],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
