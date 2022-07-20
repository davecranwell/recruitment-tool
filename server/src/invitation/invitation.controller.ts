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
import { ExtractJwt } from 'passport-jwt'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import { AuthenticationService } from 'src/authentication/authentication.service'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'
import { Action } from 'src/casl/actions'
import { Organisation } from 'src/organisation/entities/organisation.entity'

import { CreateInvitationDto } from './dto/create-invitation.dto'
import { Invitation } from './entities/invitation.entity'
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
    const ability = new Ability(request.user.abilities)

    if (!ability.can(Action.Manage, new Organisation({ id: data.organisationId }))) throw new ForbiddenException()

    return this.invitationService.create(data, request.user)
  }

  @UseGuards(InvitationCodeGuardQuery)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('check')
  async accept(@Req() request) {
    const { user } = request

    //await this.invitationService.acceptCode(user)

    return new Invitation(user)

    //console.log('here', request)
    //return this.authenticationService.register(data)
  }

  // @Get()
  // findAll() {
  //   return this.invitationService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.invitationService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInvitationDto: UpdateInvitationDto) {
  //   return this.invitationService.update(+id, updateInvitationDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.invitationService.remove(+id)
  // }
}
