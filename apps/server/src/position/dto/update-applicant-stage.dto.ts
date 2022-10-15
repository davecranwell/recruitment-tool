import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateApplicantStageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  stage: number
}
