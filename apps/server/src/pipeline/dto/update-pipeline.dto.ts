import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from 'class-validator'

export class UpdatePipelineDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  description?: string
}
