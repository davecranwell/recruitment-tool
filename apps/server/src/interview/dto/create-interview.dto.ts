import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsDateString, IsDate } from 'class-validator'

export class CreateInterviewDto {
  @ApiProperty()
  @IsDate()
  startDateTime: Date

  @ApiProperty()
  @IsDate()
  endDateTime: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  positionId: number

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  stageId: number

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  applicantProfileId: number
}
