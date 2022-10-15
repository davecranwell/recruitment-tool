import { ApiProperty } from '@nestjs/swagger'
import { UserRoleType } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateInvitationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  organisationId: number

  @ApiProperty({ required: true, enum: UserRoleType })
  @IsNotEmpty()
  @IsEnum(UserRoleType)
  role: UserRoleType
}
