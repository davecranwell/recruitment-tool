import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class UserEntity implements User {
  @ApiProperty({ required: true })
  id: number

  @ApiProperty({ required: true })
  email: string

  @ApiProperty({ required: true })
  name: string | null

  @Exclude()
  password: string

  accessToken: string
  refreshToken: string

  @Exclude()
  refreshTokenHash: string

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
