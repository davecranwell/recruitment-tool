import { Ability } from '@casl/ability'
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { Action } from 'src/casl/actions'
import { Position } from 'src/position/entities/position.entity'
import { PositionService } from 'src/position/position.service'
import { ApplicantProfileService } from 'src/applicant-profile/applicant-profile.service'

import { CreateInterviewDto } from './dto/create-interview.dto'
import { InterviewService } from './interview.service'

@ApiTags('Interview')
@ApiBearerAuth('access-token')
@Controller('interview')
@UseGuards(JwtAuthenticationGuard)
export class InterviewController {
  constructor(
    private readonly interviewService: InterviewService,
    private readonly positionService: PositionService,
    private readonly applicantProfileService: ApplicantProfileService
  ) {}

  @ApiOperation({ summary: 'Create an interview' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() data: CreateInterviewDto) {
    // get position by ID and check permissions on that project
    const position = await this.positionService.findOne(data.positionId, request.user)
    const pipeline = await this.positionService.findPipelineWithStages(data.positionId, request.user)

    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Manage, new Position(position))) throw new ForbiddenException()

    // check if stage is one allowed for this position, given the stages assigned to this project
    if (!pipeline.stages.map((stage) => stage.stageId).includes(data.stageId)) {
      throw new NotFoundException('This stage does not exist')
    }

    // check if applicantProfileId is part of this org
    await this.applicantProfileService.findOneInOrganisation(data.applicantProfileId, position.organisationId)

    return this.interviewService.create(data)
  }
}
