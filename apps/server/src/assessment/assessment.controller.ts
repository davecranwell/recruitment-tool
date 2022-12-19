import { Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApplicantProfileService } from 'src/applicant-profile/applicant-profile.service'
import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { PositionService } from 'src/position/position.service'

import { AssessmentService } from './assessment.service'
import { CreateAssessmentDto } from './dto/create-assessment.dto'
import { Assessment } from './entities/assessment.entity'

@ApiTags('Assessment')
@ApiBearerAuth('access-token')
@Controller('assessment')
@UseGuards(JwtAuthenticationGuard)
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly positionService: PositionService,
    private readonly applicantProfileService: ApplicantProfileService
  ) {}

  @ApiOperation({ summary: 'Create an interview assessment' })
  @ApiCreatedResponse({ type: () => Assessment })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() data: CreateAssessmentDto) {
    // const { attendees, positionId, applicantProfileId } = data

    // // get position by ID and check permissions on that project
    // const position = await this.positionService.findOne(positionId, request.user, { includeUserRoles: true })
    // const pipeline = await this.positionService.findPipelineWithStages(positionId, request.user)

    // const ability = new Ability(request.user.abilities)

    // if (!ability.can(Action.Manage, new Position(position))) throw new ForbiddenException()

    return this.assessmentService.create(data)
  }
}
