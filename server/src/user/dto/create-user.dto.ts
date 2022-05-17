import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, isEmail } from 'class-validator'
// import { ConnectUserDto } from 'tmp/user/dto/connect-user.dto'
// import { CreateUserDto } from 'tmp/user/dto/create-user.dto'

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @isEmail()
  email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password?: string
}
