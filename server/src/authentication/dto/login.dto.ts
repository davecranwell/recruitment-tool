import { Abilities, AbilityOptions, ClaimRawRule, RawRule } from '@casl/ability'
import { AbilityTupleType } from '@casl/ability/dist/types/types'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Type } from 'class-transformer'
import { IsEmail, IsString, IsNotEmpty, MinLength, ValidateNested } from 'class-validator'
import { UserEntity as User } from 'src/user/entities/user.entity'

export class LoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  // @MinLength(8)
  password: string

  // this field is really only for browser-based login
  // therefore not mentioned in API docs
  token: string
}

export class LoginResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => User)
  user: User

  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  abilities: any
}

export class MagicLoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string
}

export class GoogleAuthDto {
  @IsNotEmpty()
  authuser: string

  @IsNotEmpty()
  code: string

  @IsNotEmpty()
  hd: string

  @IsNotEmpty()
  prompt: string

  @IsNotEmpty()
  scope: string
}
