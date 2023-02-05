import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
// import { SlackModule } from 'nestjs-slack'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApplicantProfileModule } from './applicant-profile/applicant-profile.module'
import { AuthenticationModule } from './authentication/authentication.module'
import { CaslModule } from './casl/casl.module'
import config from './config/configuration'
import { OrganisationModule } from './organisation/organisation.module'
import { PositionModule } from './position/position.module'
import { UserModule } from './user/user.module'
//import { UsersInOrganisationModule } from './users-in-organisation/users-in-organisation.module'
//import { UserRoleModule } from './user-role/user-role.module'
//import { ApplicantProfileForOrganisationModule } from './applicant-profile-for-organisation/applicant-profile-for-organisation.module'
//import { ApplicantProfileForPositionModule } from './applicant-profile-for-position/applicant-profile-for-position.module'
//import { ProjectUserRoleModule } from './project-user-role/project-user-role.module'
//import { UserRolesOfUserModule } from './user-roles-of-user/user-roles-of-user.module'
import { AssessmentModule } from './assessment/assessment.module'
import { InterviewModule } from './interview/interview.module'
import { InvitationModule } from './invitation/invitation.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProjectController } from './project/project.controller'
import { ProjectService } from './project/project.service'
import { SchedulerModule } from './scheduler/scheduler.module'

@Module({
  imports: [
    CaslModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 10,
    }),
    // ScheduleModule.forRoot(),
    AuthenticationModule,
    OrganisationModule,
    PositionModule,
    ApplicantProfileModule,
    UserModule,
    //UsersInOrganisationModule,
    //UserRoleModule,
    //ApplicantProfileForOrganisationModule,
    //ApplicantProfileForPositionModule,
    //ProjectUserRoleModule,
    //UserRolesOfUserModule,
    InvitationModule,
    InterviewModule,
    AssessmentModule,
    SchedulerModule,
    // SlackModule.forRoot({
    //   type: 'api',
    //   token: 'xoxb-4735546228627-4721145321431-teUuZ8mHywFkDY8skX3jTM5E',
    // }),
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
