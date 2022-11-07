import { ApiProperty, PartialType } from '@nestjs/swagger'
import { PositionEmploymentType } from '@prisma/client'
import { CreateInterviewDto } from './create-interview.dto'

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  startDateTime?: Date
  endDateTime?: Date
}
