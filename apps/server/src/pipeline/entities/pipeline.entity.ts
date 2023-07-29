import { ApiProperty } from '@nestjs/swagger'
import { Pipeline as PipelineModel } from '@prisma/client'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

import { Position } from 'src/position/entities/position.entity'
import { Stage, StageWithApplicantCount } from 'src/stage/entities/stage.entity'
import { Organisation } from '~/organisation/entities/organisation.entity'

export class Pipeline implements PipelineModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  organisationId: number

  @ValidateNested()
  @ApiProperty({ type: () => Organisation })
  @Type(() => Organisation)
  organisation?: Organisation

  @ValidateNested()
  @ApiProperty({ type: () => Stage, isArray: true })
  @Type(() => Stage)
  stages?: Stage[]

  @ValidateNested()
  @ApiProperty({ type: () => Position, isArray: true })
  @Type(() => Position)
  positions?: Position[]

  constructor(partial: Partial<Pipeline>) {
    Object.assign(this, partial)
  }
}

export class PipelineStagesOnly {
  @ValidateNested()
  @ApiProperty({ type: () => StageWithApplicantCount, isArray: true })
  @Type(() => StageWithApplicantCount)
  stages?: StageWithApplicantCount[]

  constructor(partial: Partial<PipelineStagesOnly>) {
    Object.assign(this, partial)
  }
}
