import { ApiProperty } from '@nestjs/swagger'
import { Invitation as InvitationModel, UserRoleType } from '@prisma/client'
import { ValidateNested } from 'class-validator'
import { Exclude, Type } from 'class-transformer'

import { Organisation } from 'src/organisation/entities/organisation.entity'

export class Invitation implements InvitationModel {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ValidateNested()
  @Type(() => Organisation)
  organisation?: Organisation

  @ApiProperty()
  organisationId: number

  @ApiProperty()
  role: UserRoleType

  @ApiProperty()
  sent: boolean

  // TODO: add a concept of expiry for invitations

  @ApiProperty()
  createdAt: Date

  constructor(partial: Partial<Invitation>) {
    Object.assign(this, partial)
  }
}
