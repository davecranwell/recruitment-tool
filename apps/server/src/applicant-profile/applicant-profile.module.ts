import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { ApplicantProfileService } from './applicant-profile.service'
import { ApplicantProfileController } from './applicant-profile.controller'
import { UserModule } from 'src/user/user.module'
import { CaslModule } from 'src/casl/casl.module'
@Module({
  imports: [UserModule],
  controllers: [ApplicantProfileController],
  providers: [ApplicantProfileService],
})
export class ApplicantProfileModule {}
