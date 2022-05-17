import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @MaxLength(100)
  name?: string

  @ApiProperty()
  @IsEmail()
  email?: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword?: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password?: string
}
