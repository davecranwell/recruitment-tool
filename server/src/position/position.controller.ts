import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common'
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
import { ApplicantProfile, ApplicantProfileWithUser } from 'src/applicant-profile/entities/applicant-profile.entity'
import { Prisma } from '@prisma/client'

@ApiTags('Positions')
@Controller('position')
@UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiCreatedResponse({ type: Position })
  create(@Body() data: CreatePositionDto) {
    // TODO hook in orgId properly to check for ownership and also for existence of org
    return this.positionService.create(data)
  }

  @Get(':id')
  @ApiOkResponse({ type: Position })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionService.findOne(id)
  }

  @Get(':id/applicants')
  @ApiExtraModels(PaginatedDto, ApplicantProfileWithUser)
  @ApiPaginatedResponse(ApplicantProfileWithUser)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(ApplicantProfileWithUser))
  findApplicantProfiles(@Param('id', ParseIntPipe) id: number, @Query() paginationArgs: PaginationArgsDto) {
    return this.positionService.findApplicantProfiles(+id, paginationArgs)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() data: UpdatePositionDto) {
    return this.positionService.update(+id, data)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.positionService.remove(+id)
  // }
}
