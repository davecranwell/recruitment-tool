import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator'

export class UpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiProperty()
  @IsOptional()
  @MaxLength(200)
  description?: string
}
