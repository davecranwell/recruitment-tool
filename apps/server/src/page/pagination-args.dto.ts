import { applyDecorators, Type } from '@nestjs/common'

import { ApiProperty, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class PaginationArgsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  page: number
}

export class PaginationMetaDto {
  @ApiProperty()
  total: number
  @ApiProperty()
  lastPage: number
  @ApiProperty()
  currentPage: number
  @ApiProperty()
  perPage: number
  @ApiProperty()
  prev: number | null
  @ApiProperty()
  next: number | null
}

export class PaginatedDto<TData> {
  @ApiProperty({ isArray: true })
  data: TData[]

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  )
}
