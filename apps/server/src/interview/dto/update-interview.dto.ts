import { ApiProperty, PartialType } from '@nestjs/swagger'
import { PositionEmploymentType } from '@prisma/client'
import { IsDate, IsNumber } from 'class-validator'

import { CreateInterviewDto } from './create-interview.dto'

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  @ApiProperty()
  @IsDate()
  startDateTime?: Date

  @ApiProperty()
  @IsDate()
  endDateTime?: Date

  @ApiProperty({ required: true })
  @IsNumber()
  attendees: number[]
}
