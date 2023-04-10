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
import { Action } from 'src/casl/actions'
import { Position } from 'src/position/entities/position.entity'
import { PositionService } from 'src/position/position.service'

import { CreateInterviewDto } from './dto/create-interview.dto'
import { Interview } from './entities/interview.entity'
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
  @ApiCreatedResponse({ type: () => Interview })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() data: CreateInterviewDto) {
    const { attendees, positionId, applicantProfileId, stageId } = data

    // get position by ID and check permissions on that project
    const position = await this.positionService.findOne(positionId, request.user, { includeUserRoles: true })
    const pipeline = await this.positionService.findPipelineStages(positionId, request.user)

    if (!request.user.abilities.can(Action.Manage, new Position(position))) throw new ForbiddenException()

    // check if an interview with this applicant at this stage already exists
    const dupe = await this.interviewService.findByApplicantAndStage(applicantProfileId, stageId)
    if (dupe) {
      return dupe
    }

    // check if stage is one allowed for this position, given the stages assigned to this project
    if (!pipeline.stages.map((stage) => stage.id).includes(stageId)) {
      throw new NotFoundException('This stage does not exist')
    }

    // check if applicantProfileId is part of this org
    await this.applicantProfileService.findOneInOrganisation(applicantProfileId, position.organisationId)

    // check if attendees are part of this project
    if (attendees) {
      const userRoleIds = position.project.userRoles.map((userRole) => userRole.userId)
      const attendeesArr = Array.isArray(attendees) ? attendees : [attendees]

      if (!attendeesArr.every((attendee) => userRoleIds.includes(attendee))) {
        throw new ForbiddenException('One or more attendees do not exist')
      }
    }

    return this.interviewService.create(data, request.user.id)
  }
}
