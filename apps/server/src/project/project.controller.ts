import { Ability } from '@casl/ability'
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Action } from 'src/casl/actions'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'

import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Project } from './entities/project.entity'
import { ProjectService } from './project.service'

@ApiTags('Projects')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get information about one project' })
  @ApiOkResponse({ type: Project })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.projectService.findOne(+id, request.user)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: () => Project, description: 'Project created' })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Req() request: RequestWithUser, @Body() createProjectDto: CreateProjectDto) {
    if (!request.user.abilities.can(Action.Create, new Project(createProjectDto))) throw new ForbiddenException()

    return this.projectService.create(createProjectDto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: () => Project, description: 'Project modified' })
  @ApiOperation({ summary: 'Update a project' })
  @UseInterceptors(ClassSerializerInterceptor)
  async patch(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Body() data: UpdateProjectDto
  ) {
    return this.projectService.update(+id, data, request.user)
  }
}
