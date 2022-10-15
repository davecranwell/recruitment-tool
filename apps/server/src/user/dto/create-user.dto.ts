import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsEmail } from 'class-validator'
// import { ConnectUserDto } from 'tmp/user/dto/connect-user.dto'
// import { CreateUserDto } from 'tmp/user/dto/create-user.dto'

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password?: string
}
