import { ApiProperty, PartialType } from '@nestjs/swagger'
import { PositionEmploymentType } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'
import { CreatePositionDto } from './create-position.dto'

export class ApprovePositionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  approved?: boolean
}
