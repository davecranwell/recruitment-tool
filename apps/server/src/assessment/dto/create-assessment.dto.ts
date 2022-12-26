import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class CreateAssessmentDto {
  name?: string
  userId: number

  @ApiProperty()
  @IsNumber()
  applicantProfileId: number

  @ApiProperty()
  @IsNumber()
  positionId: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  score?: number

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  interviewId?: number
}

export class CreateAssessmentWithScoringDto extends CreateAssessmentDto {
  @ApiProperty()
  @IsNumber()
  scoringSystemId: number
}
