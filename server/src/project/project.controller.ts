import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { Ability } from '@casl/ability'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'
import { ApiPaginatedResponse, PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { Action } from 'src/casl/actions'

import { ProjectService } from './project.service'
import { Project } from './entities/project.entity'

import { createPaginator } from 'src/util/pagination'

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // @Get(':id')
  // @ApiOperation({ summary: 'Get information about one project' })
  // @ApiOkResponse({ type: Project })
  // async findOne(@Req() request: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
  //   const ability = new Ability(request.user.abilities)

  //   if (!ability.can(Action.Read, new Project({ id }))) throw new ForbiddenException()

  //   return this.projectService.findOne(+id)
  // }
}
