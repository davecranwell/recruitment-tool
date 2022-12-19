import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class CreateAssessmentDto {
  name?: string
  userId: number

  @ApiProperty()
  applicantProfileId: number

  @ApiProperty()
  positionId: number

  @ApiProperty({ required: false })
  @IsOptional()
  score?: number

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string

  @ApiProperty({ required: false })
  @IsOptional()
  interviewId?: number
}
