import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
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
import { Position } from 'src/position/entities/position.entity'
import { UserEntity } from 'src/user/entities/user.entity'

import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { Organisation } from './entities/organisation.entity'
import { OrganisationService } from './organisation.service'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'

@ApiTags('Organisations')
@ApiBearerAuth('access-token')
@Controller('organisation')
@UseGuards(JwtAuthenticationGuard)
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get information about one organisation' })
  @ApiOkResponse({ type: () => Organisation })
  async findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findOne(+id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiCreatedResponse({ type: () => Organisation, description: 'Organisation created' })
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
  @ApiPaginatedResponse(UsersInOrganisation)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(UsersInOrganisation))
  async findUsers(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findUsers(+id, paginationArgs)
  }

  @Get(':id/user/:userId')
  @ApiOkResponse({ type: () => UsersInOrganisation })
  @ApiOperation({ summary: 'Get one user in an organisation' })
  @UseInterceptors(ClassSerializerInterceptor)
  async findUser(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) userId: number
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findUser(id, userId)
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'List all projects in an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(UserEntity)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(UserEntity))
  async findProjects(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
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

  @Get(':id/positions/')
  @ApiOperation({ summary: 'List all positions created for an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(Position)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
  async findPositions(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findPositions(id, request.user, false, paginationArgs)
  }

  @Get(':id/positions/group-by-project')
  @ApiOperation({ summary: 'List all positions created for an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(Position)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
  async findPositionByProject(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findPositions(id, request.user, true, paginationArgs)
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
