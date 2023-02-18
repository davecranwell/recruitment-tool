import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'
import { ApiPaginatedResponse, PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'

import { ApplicantProfileForPositionWithStage } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { ApplicantProfileWithUser } from 'src/applicant-profile/entities/applicant-profile.entity'
import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { Pipeline } from 'src/pipeline/entities/pipeline.entity'
import { Stage } from 'src/stage/entities/stage.entity'
import { Position } from './entities/position.entity'

import { InterviewWithStageScoringApplicant } from 'src/interview/entities/interview.entity'
import { CreatePositionDto } from './dto/create-position.dto'
import { UpdateApplicantStageDto } from './dto/update-applicant-stage.dto'
import { UpdatePositionDto } from './dto/update-position.dto'
import { PositionQueryFeatures, PositionService } from './position.service'

@ApiTags('Positions')
@ApiBearerAuth('access-token')
@Controller('position')
@UseGuards(JwtAuthenticationGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiCreatedResponse({ type: () => Position })
  async create(@Req() request: RequestWithUser, @Body() data: CreatePositionDto) {
    return this.positionService.create(data, request.user)
  }

  @Get(':id')
  @ApiOkResponse({ type: () => Position })
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(Position))
  findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() positionFeatures: PositionQueryFeatures
  ) {
    return this.positionService.findOne(id, request.user, positionFeatures)
  }

  @Get(':id/applicants')
  @ApiExtraModels(PaginatedDto, ApplicantProfileWithUser)
  @ApiPaginatedResponse(ApplicantProfileWithUser)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(ApplicantProfileWithUser))
  findAllApplicants(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    return this.positionService.findAllApplicants(id, request.user, paginationArgs)
  }

  @Get(':id/applicants/:stageId')
  @ApiExtraModels(PaginatedDto, ApplicantProfileWithUser)
  @ApiPaginatedResponse(ApplicantProfileWithUser)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(ApplicantProfileWithUser))
  findApplicantsAtStage(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('stageId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) stageId: number,
    @Query() paginationArgs: PaginationArgsDto
  ) {
    return this.positionService.findApplicantsAtStage(id, stageId, request.user, paginationArgs)
  }

  @Get(':id/applicant/:applicantId')
  @ApiExtraModels(Stage, ApplicantProfileForPositionWithStage)
  @ApiResponse({ type: () => ApplicantProfileForPositionWithStage })
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(ApplicantProfileForPositionWithStage))
  findApplicant(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('applicantId', ParseIntPipe) applicantId: number
  ) {
    return this.positionService.findApplicant(id, applicantId, request.user)
  }

  @Patch(':id/applicant/:applicantId')
  @ApiExtraModels(ApplicantProfileWithUser)
  @ApiResponse({ type: () => ApplicantProfileWithUser })
  @UseInterceptors(ClassSerializerInterceptor)
  changeApplicantStage(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('applicantId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }))
    applicantId: number,
    @Body() data: UpdateApplicantStageDto
  ) {
    return this.positionService.changeApplicantStage(id, applicantId, data, request.user)
  }

  @Get(':id/interview/:interviewId')
  @ApiExtraModels(Stage, InterviewWithStageScoringApplicant)
  @ApiResponse({ type: () => InterviewWithStageScoringApplicant })
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(InterviewWithStageScoringApplicant))
  findApplicantInterview(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('interviewId', ParseIntPipe) interviewId: number
  ) {
    return this.positionService.findInterviewById(id, interviewId, request.user)
  }

  @Get(':id/pipeline')
  @ApiOkResponse({ type: () => Pipeline })
  findPipelineStages(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.positionService.findPipelineStages(id, request.user)
  }

  @Patch(':id')
  update(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: string,
    @Body() data: UpdatePositionDto
  ) {
    return this.positionService.update(+id, data, request.user)
  }
}
