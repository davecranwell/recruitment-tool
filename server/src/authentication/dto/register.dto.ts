import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, IsJWT, Matches } from 'class-validator'

import { Match } from 'src/util/match.decorator'
export class RegisterDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}

export class RegisterFromInvitationDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, {
    message: 'Password should contain lowercase and uppercase letters, as well as numbers',
  })
  password: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Match('password', { message: 'Your confirmation password does not match your password' })
  passwordConfirmation: string

  @ApiProperty({ required: true, description: 'An invitation code (in form of a JWT)' })
  @IsJWT()
  @IsNotEmpty()
  token: string
}
