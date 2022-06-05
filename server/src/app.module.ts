import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import config from './config/configuration'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthenticationModule } from './authentication/authentication.module'
import { UserModule } from './user/user.module'
import { UpdatesModule } from './updates/updates.module'
import { OrganisationModule } from './organisation/organisation.module'
import { UsersInOrganisationModule } from './users-in-organisation/users-in-organisation.module'
import { PositionModule } from './position/position.module'
import { UserRoleModule } from './user-role/user-role.module'
import { ApplicantProfileForOrganisationModule } from './applicant-profile-for-organisation/applicant-profile-for-organisation.module'
import { ApplicantProfileModule } from './applicant-profile/applicant-profile.module'
import { ApplicantProfileForPositionModule } from './applicant-profile-for-position/applicant-profile-for-position.module'
import { PositionUserRoleModule } from './position-user-role/position-user-role.module'
import { PositionRoleModule } from './position-role/position-role.module'
import { UserRolesOfUserModule } from './user-roles-of-user/user-roles-of-user.module'
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1,
    }),
    AuthenticationModule,
    UpdatesModule,
    UserModule,
    OrganisationModule,
    UsersInOrganisationModule,
    PositionModule,
    UserRoleModule,
    ApplicantProfileForOrganisationModule,
    ApplicantProfileModule,
    ApplicantProfileForPositionModule,
    PositionUserRoleModule,
    PositionRoleModule,
    UserRolesOfUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
