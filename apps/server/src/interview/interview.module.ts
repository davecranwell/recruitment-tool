import { Module } from '@nestjs/common'

import { ApplicantProfileModule } from 'src/applicant-profile/applicant-profile.module'
import { PositionModule } from 'src/position/position.module'

import { InterviewController } from './interview.controller'
import { InterviewService } from './interview.service'

@Module({
  imports: [PositionModule, ApplicantProfileModule],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
