import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { ApplicantProfile } from 'src/applicant-profile/entities/applicant-profile.entity'
import { PositionOnlyOrgId } from 'src/position/entities/position.entity'
import { Stage } from 'src/stage/entities/stage.entity'

export class ApplicantProfileForPosition {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ApplicantProfile)
  applicantProfile?: ApplicantProfile

  @ApiProperty()
  applicantProfileId: number

  @ValidateNested()
  @Type(() => PositionOnlyOrgId)
  position?: PositionOnlyOrgId

  @ApiProperty()
  positionId: number

  @Exclude()
  createdAt: Date

  @Exclude()
  updatedAt: Date

  constructor(partial: Partial<ApplicantProfileForPosition>) {
    Object.assign(this, partial)
  }
}

export class ApplicantProfileForPositionWithStage extends ApplicantProfileForPosition {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Stage)
  stage: Stage

  constructor(partial: Partial<ApplicantProfileForPositionWithStage>) {
    super(partial)
    Object.assign(this, partial)
  }
}
