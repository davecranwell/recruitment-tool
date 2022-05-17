import { Controller, Get, Post, Body, Patch, Query, Param, Delete, UseInterceptors, HttpCode } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger'

import { PaginationArgsDto, PaginatedDto, ApiPaginatedResponse } from 'src/page/pagination-args.dto'
import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import { PositionService } from './position.service'

import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'

import { Position } from './entities/position.entity'

@ApiTags('Positions')
@Controller('organisation/:orgId/position')
@UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiCreatedResponse({ type: Position })
  create(@Param('orgId') orgId: number, @Body() data: CreatePositionDto) {
    // TODO hook in orgId properly
    return this.positionService.create(data)
  }

  @Get()
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(Position)
  findAll(@Param('orgId') orgId: number, @Query() paginationArgs: PaginationArgsDto) {
    return this.positionService.findByOrg(+orgId, paginationArgs)
  }

  @Get(':id')
  @ApiOkResponse({ type: Position })
  findOne(@Param('orgId') orgId: number, @Param('id') id: string) {
    return this.positionService.findOne(+orgId, +id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
  //   return this.positionService.update(+id, updatePositionDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.positionService.remove(+id)
  // }
}
