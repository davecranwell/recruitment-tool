import { UserRoleType } from '@prisma/client'
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsEnum } from 'class-validator'

export class PatchOrganisationUserDto {
  @ApiProperty({ required: true, enum: UserRoleType })
  @IsNotEmpty()
  @IsEnum(UserRoleType)
  role: UserRoleType
}
