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

import { CreateInvitationDto } from './dto/create-invitation.dto'
import { InvitationService } from './invitation.service'
import { InvitationCodeGuardQuery } from './guards/invitationCode.guard'

@ApiTags('Invitation')
@ApiBearerAuth('access-token')
@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({ summary: 'Invite a user to your organisation' })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Req() request: RequestWithUser, @Body() data: CreateInvitationDto) {
    if (!request.user.abilities.can(Action.Manage, new Organisation({ id: data.organisationId })))
      throw new ForbiddenException()

    return this.invitationService.create(data, request.user)
  }

  @UseGuards(InvitationCodeGuardQuery)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('check')
  async accept(@Req() request) {
    const { user } = request

    return user
  }
}
