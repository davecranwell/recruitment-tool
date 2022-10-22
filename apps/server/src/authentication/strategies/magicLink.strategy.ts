import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { UserService } from 'src/user/user.service'
import { MagicTokenPayload } from './types'

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy, 'magic-link') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('MAGIC_LINK_SECRET'),
    })
  }

  async validate(payload: MagicTokenPayload) {
    const { email } = payload

    try {
      return await this.userService.getByEmail(email)
    } catch {
      return { email }
    }
  }
}
