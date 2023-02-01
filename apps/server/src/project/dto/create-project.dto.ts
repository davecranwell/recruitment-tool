import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator'

export class CreateProjectDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty()
  @IsOptional()
  @MaxLength(200)
  description?: string

  @ApiProperty({ required: true })
  @IsNumber()
  organisationId: number
}
