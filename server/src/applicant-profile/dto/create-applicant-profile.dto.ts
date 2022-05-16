import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator'
// import { ConnectUserDto } from 'tmp/user/dto/connect-user.dto'
// import { CreateUserDto } from 'tmp/user/dto/create-user.dto'

export class CreateApplicantProfileDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(50)
  profileName: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  askingSalary: number
}
