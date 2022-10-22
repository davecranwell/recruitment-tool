import { Ability } from '@casl/ability'
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from 'src/authentication/authentication.controller'

import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { Action } from 'src/casl/actions'
import { Organisation } from 'src/organisation/entities/organisation.entity'

import { CreateInterviewDto } from './dto/create-interview.dto
import { InterviewService } from './interview.service'

@ApiTags('Interview')
@ApiBearerAuth('access-token')
@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @ApiOperation({ summary: 'Create an interview' })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() data: CreateInterviewDto) {
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Manage, new Project({ id: data.organisationId }))) throw new ForbiddenException()

    return this.interviewService.create(data, request.user)
}
  async accept(@Req() request) {
    const { user } = request

    return user
  
}
