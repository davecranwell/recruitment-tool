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
}

export class MagicLoginDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
