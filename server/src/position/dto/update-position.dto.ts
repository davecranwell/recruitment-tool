import { ApiProperty, PartialType } from '@nestjs/swagger'
import { PositionEmploymentType } from '@prisma/client'
import { CreatePositionDto } from './create-position.dto'

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  name?: string
  description?: string
  openingDate?: Date
  closingDate?: Date
  @ApiProperty({ enum: PositionEmploymentType })
  employment?: PositionEmploymentType
  location?: string
  salaryRange?: string
}
