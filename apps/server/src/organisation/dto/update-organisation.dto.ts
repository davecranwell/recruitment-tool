import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from 'class-validator'

export class UpdateOrganisationDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string
}
