import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  ForbiddenException,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'
import { ApiPaginatedResponse, PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { Action } from 'src/casl/actions'
import { Position } from 'src/position/entities/position.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'

import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { PatchOrganisationUserDto } from './dto/patch-organisation-user.dto'

import { Organisation } from './entities/organisation.entity'
import { OrganisationService } from './organisation.service'
import { PositionCount, Project, ProjectOnly } from 'src/project/entities/project.entity'
import { ProjectService } from 'src/project/project.service'
import { Pipeline } from '~/pipeline/entities/pipeline.entity'
import { UpdateOrganisationDto } from '~/organisation/dto/update-organisation.dto'

@ApiTags('Organisations')
@ApiBearerAuth('access-token')
@Controller('organisation')
@UseGuards(JwtAuthenticationGuard)
export class OrganisationController {
  constructor(
    private readonly organisationService: OrganisationService,
    private readonly projectService: ProjectService
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get information about one organisation' })
  @ApiOkResponse({ type: () => Organisation })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.organisationService.findOne(+id, request.user)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiCreatedResponse({ type: () => Organisation, description: 'Organisation created' })
  async create(
    @Req() request: RequestWithUser,
    @Body() createOrganisationDto: CreateOrganisationDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        exceptionFactory(error) {
          throw new BadRequestException('The uploaded file must be less than 1MB in size, and of the format jpg/png')
        },
      })
    )
    file: Express.Multer.File
  ) {
    return this.organisationService.create(createOrganisationDto, request.user, file)
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
    if (!request.user.abilities.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

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
    if (!request.user.abilities.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findUser(id, userId)
  }

  @Patch(':id/user/:userId')
  @ApiOkResponse({ type: () => UsersInOrganisation })
  @ApiOperation({ summary: 'Update one user in an organisation' })
  @UseInterceptors(ClassSerializerInterceptor)
  async patchUser(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) userId: number,
    @Body() patchData: PatchOrganisationUserDto
  ) {
    if (!request.user.abilities.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.patchUser(id, userId, patchData)
  }

  @Patch(':id')
  @ApiOkResponse({ type: () => UsersInOrganisation })
  @ApiOperation({ summary: 'Update the organisation' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('logo'))
  async patchOrganisationLogo(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Body() patchData: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        exceptionFactory(error) {
          throw new BadRequestException('The uploaded file must be less than 1MB in size, and of the format jpg/png')
        },
      })
    )
    logo: Express.Multer.File
  ) {
    return this.organisationService.patchOrganisation(id, request.user, patchData, logo)
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'List all projects in an organisation' })
  @ApiPaginatedResponse(ProjectOnly)
  @ApiExtraModels(PaginatedDto, ProjectOnly, PositionCount)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(ProjectOnly))
  async findProjects(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    if (!request.user.abilities.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findProjects(+id, request.user, paginationArgs)
  }

  @Get(':id/pipelines')
  @ApiOperation({ summary: 'List all pipelines used in an organisation' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(Pipeline)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Pipeline))
  async findPipelines(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    if (!request.user.abilities.can(Action.Manage, new Organisation({ id }))) throw new ForbiddenException()

    return this.organisationService.findPipelines(+id, request.user, paginationArgs)
  }

  // @Get()
  // @ApiExtraModels(PaginatedDto)
  // @ApiPaginatedResponse(Position)
  // findAll(@Param('orgId') orgId: number, @Query() paginationArgs: PaginationArgsDto) {
  //   return this.positionService.findByOrg(+orgId, paginationArgs)
  // }

  // TODO: disabled this because without the project specified, it's impossible to know which project role the user might be playing,
  // so the positions returned can't be checked meaningfully for conditions where the user should or shouldn't be able to see them
  //
  // @Get(':id/positions/')
  // @ApiOperation({ summary: 'List all positions created for an organisation' })
  // @ApiExtraModels(PaginatedDto)
  // @ApiPaginatedResponse(Position)
  // @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
  // async findPositions(
  //   @Req() request: RequestWithUser,
  //   @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
  //   @Query() paginationArgs: PaginationArgsDto
  // ) {
  //   if (!request.user.abilities.can(Action.Read, new Organisation({ id }))) throw new ForbiddenException()

  //   return this.organisationService.findPositions(id, request.user, paginationArgs)
  // }

  @Get(':id/project/:projectId/positions')
  @ApiOperation({ summary: 'List positions by project' })
  @ApiExtraModels(PaginatedDto)
  @ApiPaginatedResponse(Position)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
  async findPositionByProject(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('projectId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) projectId: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    const project = await this.projectService.findOne(projectId, request.user)

    if (project.organisationId !== id) throw new NotFoundException()

    if (
      !request.user.abilities.can(Action.Read, new Organisation({ id })) ||
      !request.user.abilities.can(Action.Read, new Project(project))
    ) {
      throw new ForbiddenException()
    }

    return this.organisationService.findPositionsByProject(id, projectId, request.user, paginationArgs)
  }
}
