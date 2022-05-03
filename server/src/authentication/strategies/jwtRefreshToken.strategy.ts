import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { UsersService } from 'src/users/users.service'
import { JwtTokenPayload } from './types'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: JwtTokenPayload) {
    return this.usersService.getUserIfRefreshTokenMatches(
      ExtractJwt.fromAuthHeaderAsBearerToken()(request),
      payload.userId
    )
  }
}
