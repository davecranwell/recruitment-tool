import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator'

export class CreateOrganisationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  userId: number
}
