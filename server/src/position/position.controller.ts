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

import { PositionService } from './position.service'

import { CreatePositionDto } from './dto/create-position.dto'
import { UpdateApplicantStageDto } from './dto/update-applicant-stage.dto'
import { UpdatePositionDto } from './dto/update-position.dto'

import { ApplicantProfileWithUser } from 'src/applicant-profile/entities/applicant-profile.entity'
import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { Pipeline } from 'src/pipeline/entities/pipeline.entity'
import { Position } from './entities/position.entity'

@ApiTags('Positions')
@ApiBearerAuth('access-token')
@Controller('position')
@UseGuards(JwtAuthenticationGuard)
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiCreatedResponse({ type: Position })
  async create(@Req() request: RequestWithUser, @Body() data: CreatePositionDto) {
    return this.positionService.create(data, request.user)
  }

  @Get(':id')
  @ApiOkResponse({ type: Position })
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.positionService.findOne(id, request.user)
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

  @Get(':id/applicant/:applicantId')
  @ApiExtraModels(ApplicantProfileWithUser)
  @ApiResponse({ type: ApplicantProfileWithUser })
  findApplicant(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number,
    @Param('applicantId', ParseIntPipe) applicantId: number
  ) {
    return this.positionService.findApplicant(id, applicantId, request.user)
  }

  @Patch(':positionId/applicant/:applicantProfileId')
  @ApiExtraModels(ApplicantProfileWithUser)
  @ApiResponse({ type: ApplicantProfileWithUser })
  changeApplicantStage(
    @Req() request: RequestWithUser,
    @Param('positionId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) positionId: number,
    @Param('applicantProfileId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND }))
    applicantProfileId: number,
    @Body() data: UpdateApplicantStageDto
  ) {
    return this.positionService.changeApplicantStage(positionId, applicantProfileId, data, request.user)
  }

  @Get(':id/pipeline')
  @ApiOkResponse({ type: Pipeline })
  findPipelineWithStages(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.positionService.findPipelineWithStages(id, request.user)
  }

  @Patch(':id')
  update(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: string,
    @Body() data: UpdatePositionDto
  ) {
    return this.positionService.update(+id, data, request.user)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.positionService.remove(+id)
  // }
}
