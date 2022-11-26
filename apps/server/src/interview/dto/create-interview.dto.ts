import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsDateString,
  IsDate,
  IsOptional,
} from 'class-validator'

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

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  attendees?: number[]
}
