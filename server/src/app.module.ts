import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'

import config from './config/configuration'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthenticationModule } from './authentication/authentication.module'
import { UpdatesModule } from './updates/updates.module'
import { OrganisationModule } from './organisation/organisation.module'
import { PositionModule } from './position/position.module'
import { ApplicantProfileModule } from './applicant-profile/applicant-profile.module'
import { CaslModule } from './casl/casl.module'
import { UsersInOrganisationModule } from './users-in-organisation/users-in-organisation.module'
import { UserModule } from './user/user.module'
import { UserRoleModule } from './user-role/user-role.module'
import { ApplicantProfileForOrganisationModule } from './applicant-profile-for-organisation/applicant-profile-for-organisation.module'
import { ApplicantProfileForPositionModule } from './applicant-profile-for-position/applicant-profile-for-position.module'
import { ProjectUserRoleModule } from './project-user-role/project-user-role.module'
import { UserRolesOfUserModule } from './user-roles-of-user/user-roles-of-user.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';

@Module({
  imports: [
    CaslModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 10,
    }),
    AuthenticationModule,
    UpdatesModule,
    OrganisationModule,
    PositionModule,
    ApplicantProfileModule,
    UserModule,
    UsersInOrganisationModule,
    UserRoleModule,
    ApplicantProfileForOrganisationModule,
    ApplicantProfileForPositionModule,
    ProjectUserRoleModule,
    UserRolesOfUserModule,
  ],
  controllers: [AppController, ProjectController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ProjectService,
  ],
})
export class AppModule {}
