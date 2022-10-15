import { ApiProperty } from '@nestjs/swagger'
import { Pipeline as PipelineModel } from '@prisma/client'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

import { Position } from 'src/position/entities/position.entity'
import { Stage } from 'src/stage/entities/stage.entity'
import { StagesInPipeline } from 'src/stages-in-pipeline/entities/stages-in-pipeline.entity'

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

  @ValidateNested()
  @Type(() => Stage)
  stages?: StagesInPipeline[]

  @ValidateNested()
  @Type(() => Position)
  positions?: Position[]
}
