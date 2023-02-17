import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, MaxLength, IsOptional, IsNumber, IsNumberString } from 'class-validator'

import { NoArrayIntersection } from 'src/util/noIntersection.constraint.decorator'

export class UpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiProperty()
  @IsOptional()
  @MaxLength(200)
  description?: string

  @ApiProperty({ isArray: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [parseInt(value, 10)]
    return value.map((val) => parseInt(val, 10))
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  @NoArrayIntersection('interviewers', {
    message: 'Hiring managers and Interviewers can not have both roles at once on a project',
  })
  hiringManagers?: number[]

  @ApiProperty({ isArray: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [parseInt(value, 10)]
    return value.map((val) => parseInt(val, 10))
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  @NoArrayIntersection('hiringManagers', {
    message: 'Hiring managers and Interviewers can not have both roles at once on a project',
  })
  interviewers?: number[]
}
