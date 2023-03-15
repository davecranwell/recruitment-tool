import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator'
import { NoArrayIntersection } from 'src/util/noIntersection.constraint.decorator'
import { UpdateProjectDto } from './update-project.dto'

export class CreateProjectDto extends UpdateProjectDto {
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

  @ApiProperty({ required: true })
  @IsNumber()
  defaultPipelineId: number
}
