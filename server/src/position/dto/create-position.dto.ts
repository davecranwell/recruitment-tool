import { PositionEmploymentType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsDateString, IsDate } from 'class-validator'

export class CreatePositionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(50)
  name: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  @IsDate()
  openingDate?: Date

  @ApiProperty()
  @IsDate()
  closingDate?: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  projectId: number

  @ApiProperty({ enum: PositionEmploymentType })
  employment?: PositionEmploymentType

  @ApiProperty()
  location?: string

  @ApiProperty()
  salaryRange?: string
}
