import { ApiProperty } from '@nestjs/swagger'
import { Project as ProjectModel } from '@prisma/client'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { ProjectUserRole } from 'src/project-user-role/entities/project-user-role.entity'
import { Position } from 'src/position/entities/position.entity'
import { Exclude, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class Project implements ProjectModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  organisationId: number

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

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial)
  }
}
