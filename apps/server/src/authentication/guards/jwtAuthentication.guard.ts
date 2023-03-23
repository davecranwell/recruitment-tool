import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
  // Override standard handleRequest to prevent it throwing an annoying error to the log each time a JWT is merely expired
  handleRequest(err, user, info, context, status) {
    if (err || !user) {
      throw new UnauthorizedException('JWT error')
    }
    return super.handleRequest(err, user, info, context, status)
  }
}
