import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Prisma, Project as ProjectModel } from '@prisma/client'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { ProjectUserRole } from 'src/project-user-role/entities/project-user-role.entity'
import { Position } from 'src/position/entities/position.entity'
import { Exclude, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { Pipeline } from 'src/pipeline/entities/pipeline.entity'

export class Project implements ProjectModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  organisationId: number

  @ApiProperty()
  defaultPipelineId: number

  @ApiProperty()
  approvalsNeeded: number | null

  @Exclude()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  organisation?: Organisation

  @ValidateNested()
  @ApiProperty({ type: () => ProjectUserRole })
  @Type(() => ProjectUserRole)
  userRoles?: ProjectUserRole[]
  positions?: Position[]

  @ValidateNested()
  @ApiProperty({ type: () => Pipeline })
  @Type(() => Pipeline)
  defaultPipeline?: Pipeline

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial)
  }
}

export class PositionCount {
  @ApiProperty()
  positions: number
}

export class ProjectOnly extends OmitType(Project, [
  'positions',
  'userRoles',
  'organisation',
  'defaultPipeline',
] as const) {
  @ApiProperty({ type: () => PositionCount })
  @Type(() => PositionCount)
  _count?: PositionCount

  constructor(partial: Partial<ProjectOnly>) {
    super(partial)
    Object.assign(this, partial)
  }
}
