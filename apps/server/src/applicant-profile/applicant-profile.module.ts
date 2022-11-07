import { Module } from '@nestjs/common'

import { UserModule } from 'src/user/user.module'
import { ApplicantProfileController } from './applicant-profile.controller'
import { ApplicantProfileService } from './applicant-profile.service'

@Module({
  imports: [UserModule],
  controllers: [ApplicantProfileController],
  providers: [ApplicantProfileService],
  exports: [ApplicantProfileService],
})
export class ApplicantProfileModule {}
