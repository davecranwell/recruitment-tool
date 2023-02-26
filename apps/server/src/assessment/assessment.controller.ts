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
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApplicantProfileService } from 'src/applicant-profile/applicant-profile.service'
import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { PositionService } from 'src/position/position.service'
import { Position } from 'src/position/entities/position.entity'
import { Action } from 'src/casl/actions'

import { AssessmentService } from './assessment.service'
import { CreateAssessmentDto } from './dto/create-assessment.dto'
import { Assessment } from './entities/assessment.entity'
import { InterviewService } from 'src/interview/interview.service'

@ApiTags('Assessment')
@ApiBearerAuth('access-token')
@Controller('assessment')
@UseGuards(JwtAuthenticationGuard)
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly positionService: PositionService,
    private readonly applicantProfileService: ApplicantProfileService,
    private readonly interviewService: InterviewService
  ) {}

  @ApiOperation({ summary: 'Create an interview assessment' })
  @ApiCreatedResponse({ type: () => Assessment })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() data: CreateAssessmentDto) {
    const { positionId, applicantProfileId, interviewId } = data

    // get position by ID and check permissions on that project
    const position = await this.positionService.findOne(positionId, request.user, { includeUserRoles: true })

    if (
      !request.user.abilities.can(Action.Manage, new Position(position)) &&
      !request.user.abilities.can(Action.Read, new Position(position))
    ) {
      throw new ForbiddenException()
    }

    // check if applicantProfileId is part of this org
    await this.applicantProfileService.findOneInOrganisation(applicantProfileId, position.organisationId)

    // check if interviewId exists and is for this applicant and this position
    const interview = await this.interviewService.getById(interviewId)
    if (!interview || interview.applicantProfileId !== applicantProfileId || interview.positionId !== positionId)
      throw new NotFoundException('That interview does not exist')

    return this.assessmentService.createOrUpdateForInterview(
      { ...data, scoringSystemId: interview.scoringSystemId },
      request.user.id
    )
  }
}
