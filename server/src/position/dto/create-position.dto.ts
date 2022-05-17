import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator'

export class CreatePositionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(50)
  name: string

  @ApiProperty()
  description?: string

  @ApiProperty()
  openingDate?: Date

  @ApiProperty()
  closingDate?: Date

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  organisationId: number
}
