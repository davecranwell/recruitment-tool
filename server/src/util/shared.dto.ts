import { IsNumber, IsNumberString } from 'class-validator'

export class FindOneDto {
  @IsNumber()
  id: number
}
