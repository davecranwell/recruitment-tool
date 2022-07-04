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
  ParseIntPipe,
  Req,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiExtraModels,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger'

import { PaginationArgsDto, PaginatedDto, ApiPaginatedResponse } from 'src/page/pagination-args.dto'
import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { RequestWithUser } from 'src/authentication/authentication.controller'

import { UserEntity } from 'src/user/entities/user.entity'
import { Position } from 'src/position/entities/position.entity'
import { Project } from 'src/project/entities/project.entity'
import { OrganisationService } from './organisation.service'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { UpdateOrganisationDto } from './dto/update-organisation.dto'
import { Organisation } from './entities/organisation.entity'
import { CaslPermissions } from 'src/casl/casl.permissions'

import { Action } from 'src/casl/actions'
import { Ability } from '@casl/ability'

@ApiTags('Organisations')
@ApiBearerAuth('access-token')
@Controller('organisation')
@UseGuards(JwtAuthenticationGuard)
export class OrganisationController {
  constructor(
    private readonly organisationService: OrganisationService,
    private readonly caslPermissions: CaslPermissions
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get information about one organisation' })
  @ApiOkResponse({ type: Organisation })
  async findOne(@Req() request: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findOne(+id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiCreatedResponse({ type: Organisation, description: 'Organisation created' })
  async create(@Req() request: RequestWithUser, @Body() createOrganisationDto: CreateOrganisationDto) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Create, new Organisation(createOrganisationDto))) throw new ForbiddenException()

    return this.organisationService.create(createOrganisationDto)
  }

  // @Get()
  // @ApiOkResponse({ type: Organisation, isArray: true })
  // findAll() {
  //   return this.organisationService.findAll()
  // }

  @Get(':id/users')
  @ApiOperation({ summary: 'List all users invited to an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(UserEntity)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(UserEntity))
  async findUsers(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findUsers(+id, paginationArgs)
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'List all projects in an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(UserEntity)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(UserEntity))
  async findProjects(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findProjects(+id, request.user, paginationArgs)
  }

  // @Get()
  // @ApiExtraModels(PaginatedDto)
  // @ApiPaginatedResponse(Position)
  // findAll(@Param('orgId') orgId: number, @Query() paginationArgs: PaginationArgsDto) {
  //   return this.positionService.findByOrg(+orgId, paginationArgs)
  // }

  @Get(':id/positions')
  @ApiOperation({ summary: 'List all positions created for an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(Position)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
  async findPositions(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findPositions(id, request.user, paginationArgs)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
  //   return this.organisationService.update(+id, updateOrganisationDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.organisationService.remove(+id)
  // }
}
