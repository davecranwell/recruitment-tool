import { Module } from '@nestjs/common'
import { UsersInOrganisationService } from './users-in-organisation.service'
import { UsersInOrganisationController } from './users-in-organisation.controller'

@Module({
  controllers: [UsersInOrganisationController],
  providers: [UsersInOrganisationService],
})
export class UsersInOrganisationModule {}
