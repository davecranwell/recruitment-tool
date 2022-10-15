import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator'

export class UpdateOrganisationDto {
  @ApiProperty()
  @MaxLength(100)
  name?: string

  @ApiProperty()
  @MaxLength(100)
  machineName?: string
}
