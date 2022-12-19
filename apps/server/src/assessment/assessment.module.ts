import { Module } from '@nestjs/common'

import { ApplicantProfileModule } from 'src/applicant-profile/applicant-profile.module'
import { PositionModule } from 'src/position/position.module'

import { AssessmentController } from './assessment.controller'
import { AssessmentService } from './assessment.service'

@Module({
  imports: [PositionModule, ApplicantProfileModule],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
