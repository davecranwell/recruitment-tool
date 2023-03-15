import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreatePipelineDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  description?: string
}
