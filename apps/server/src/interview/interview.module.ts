import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { InterviewService } from './interview.service'
import { InterviewController } from './interview.controller'

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService, InvitationCodeStra],
  exports: [InterviewService],
})
export class InterviewModule {}
