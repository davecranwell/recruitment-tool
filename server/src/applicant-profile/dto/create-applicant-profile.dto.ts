import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from 'class-validator'

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
