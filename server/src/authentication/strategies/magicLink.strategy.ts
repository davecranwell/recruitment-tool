import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { UsersService } from 'src/users/users.service'
import { MagicTokenPayload } from './types'

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy, 'magic-link') {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: configService.get('MAGIC_LINK_SECRET'),
    })
  }

  async validate(payload: MagicTokenPayload) {
    const { email } = payload

    try {
      return await this.usersService.getByEmail(email)
    } catch {
      return { email }
    }
  }
}
