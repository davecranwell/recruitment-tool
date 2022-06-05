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
import { OrganisationService } from './organisation.service'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { UpdateOrganisationDto } from './dto/update-organisation.dto'
import { Organisation } from './entities/organisation.entity'
import { OrganisationPermissions } from './organisation.permissions'

import { Action } from 'src/casl/actions'

@ApiTags('Organisations')
@ApiBearerAuth('access-token')
@Controller('organisation')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(PrismaClassSerializerInterceptorPaginated(Organisation))
export class OrganisationController {
  constructor(
    private readonly organisationService: OrganisationService,
    private readonly organisationPermissions: OrganisationPermissions
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiCreatedResponse({ type: Organisation, description: 'Organisation created' })
  create(@Req() request: RequestWithUser, @Body() createOrganisationDto: CreateOrganisationDto) {
    const ability = this.organisationPermissions.createForUser(request.user)

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
    const ability = this.organisationPermissions.createForUser(request.user)

    if (!ability.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findUsers(+id, paginationArgs)
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
    const ability = this.organisationPermissions.createForUser(request.user)

    if (!ability.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findPositions(id, paginationArgs)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get information about one organisation' })
  @ApiOkResponse({ type: Organisation })
  findOne(@Req() request: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const ability = this.organisationPermissions.createForUser(request.user)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findOne(+id)
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
