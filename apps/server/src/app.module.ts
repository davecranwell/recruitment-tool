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
import { AssessmentModule } from './assessment/assessment.module'
import { InterviewModule } from './interview/interview.module'
import { InvitationModule } from './invitation/invitation.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProjectModule } from './project/project.module'
import { SchedulerModule } from './scheduler/scheduler.module'
import { PipelineModule } from '~/pipeline/pipeline.module'
import { FileServiceModule } from './file-service/file-service.module'

@Module({
  imports: [
    CaslModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 20,
    }),
    AuthenticationModule,
    OrganisationModule,
    PositionModule,
    ApplicantProfileModule,
    UserModule,
    InvitationModule,
    InterviewModule,
    AssessmentModule,
    SchedulerModule,
    ProjectModule,
    PipelineModule,
    FileServiceModule,
    // SlackModule.forRoot({
    //   type: 'api',
    //   token: 'xoxb-4735546228627-4721145321431-teUuZ8mHywFkDY8skX3jTM5E',
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
