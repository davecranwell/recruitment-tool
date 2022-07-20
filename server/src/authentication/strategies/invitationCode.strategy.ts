import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { InvitationService } from 'src/invitation/invitation.service'
import { InvitationTokenPayload } from './types'

@Injectable()
export class InvitationCodeStrategyByBody extends PassportStrategy(Strategy, 'invitation-code-body') {
  constructor(private readonly configService: ConfigService, private readonly invitationService: InvitationService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('INVITATION_CODE_SECRET'),
    })
  }

  async validate(payload: InvitationTokenPayload) {
    const { id } = payload
    try {
      return await this.invitationService.getById(id)
    } catch {
      return { id }
    }
  }
}
