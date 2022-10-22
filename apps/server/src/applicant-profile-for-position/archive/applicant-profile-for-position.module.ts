import { Module } from '@nestjs/common'
import { ApplicantProfileForPositionService } from './applicant-profile-for-position.service'
import { ApplicantProfileForPositionController } from './applicant-profile-for-position.controller'

@Module({
  controllers: [ApplicantProfileForPositionController],
  providers: [ApplicantProfileForPositionService],
})
export class ApplicantProfileForPositionModule {}
