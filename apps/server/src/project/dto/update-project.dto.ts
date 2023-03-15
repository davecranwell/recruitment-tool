import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, MaxLength, IsOptional, IsNumber, IsNumberString, Min, Max, ValidateIf } from 'class-validator'

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

  @ApiProperty()
  @IsNumber()
  defaultPipelineId: number

  @ApiProperty()
  @ValidateIf((obj) => obj.financialManagers)
  @Min(1)
  @Max(10)
  approvalsNeeded?: number

  @ApiProperty({ isArray: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [parseInt(value, 10)]
    return value.map((val) => parseInt(val, 10))
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  @NoArrayIntersection(['interviewers', 'financialManagers'], {
    message: 'Financial managers, Hiring managers and Interviewers can not share multiple roles',
  })
  hiringManagers?: number[]

  @ApiProperty({ isArray: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [parseInt(value, 10)]
    return value.map((val) => parseInt(val, 10))
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  @NoArrayIntersection(['financialManagers', 'hiringManagers'], {
    message: 'Financial managers, Hiring managers and Interviewers can not share multiple roles',
  })
  interviewers?: number[]

  @ApiProperty({ isArray: true })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) return [parseInt(value, 10)]
    return value.map((val) => parseInt(val, 10))
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  @NoArrayIntersection(['interviewers', 'hiringManagers'], {
    message: 'Financial managers, Hiring managers and Interviewers can not share multiple roles',
  })
  financialManagers?: number[]
}
