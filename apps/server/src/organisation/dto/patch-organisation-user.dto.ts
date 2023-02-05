import { ApiProperty } from '@nestjs/swagger'
import { UserRoleType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class PatchOrganisationUserDto {
  @ApiProperty({ enum: UserRoleType })
  @IsNotEmpty()
  @IsEnum(UserRoleType)
  @IsOptional()
  role: UserRoleType

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  name: string
}
