import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator'

import { CreateApplicantProfileDto } from './create-applicant-profile.dto'

export class UpdateApplicantProfileDto extends PartialType(CreateApplicantProfileDto) {
  profileName?: string
  askingSalary?: string
}
