import { ApiProperty, ApiUnprocessableEntityResponse } from '@nestjs/swagger'
import { ValidateNested } from 'class-validator'
import { Exclude, Expose, Type } from 'class-transformer'
import { Position as PositionModel, PositionEmploymentType } from '@prisma/client'

import { Organisation } from 'src/organisation/entities/organisation.entity'
import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Pipeline } from 'src/pipeline/entities/pipeline.entity'
import { Project } from 'src/project/entities/project.entity'

export class Position implements PositionModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string | null

  @ApiProperty()
  openingDate: Date | null

  @ApiProperty()
  closingDate: Date | null

  @ApiProperty()
  createdAt: Date

  @ValidateNested()
  @Type(() => Pipeline)
  pipeline?: Pipeline

  @ApiProperty()
  pipelineId: number

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  projectId: number

  @ApiProperty()
  organisationId: number

  @ApiProperty({ enum: PositionEmploymentType })
  employment: PositionEmploymentType | null

  @ApiProperty()
  location: string | null

  @ApiProperty({ description: 'May not be present if unsufficiently privileged in position role' })
  @Expose({ groups: ['manager'] })
  salaryRange: string | null

  @ValidateNested()
  @Type(() => Project)
  project?: Project

  @ValidateNested()
  @Type(() => Organisation)
  organisation?: Organisation

  @ValidateNested()
  @Type(() => ApplicantProfile)
  applicantProfiles?: ApplicantProfileForPosition[]

  constructor(partial: Partial<Position>) {
    Object.assign(this, partial)
  }
}
