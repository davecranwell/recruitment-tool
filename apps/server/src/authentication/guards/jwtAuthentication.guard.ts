import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
  // Override standard handleRequest to prevent it throwing an annoying error to the log each time a JWT is merely expired
  handleRequest(err, user, info, context, status) {
    if (err || !user) {
      throw new BadRequestException()
    }
    return super.handleRequest(err, user, info, context, status)
  }
}
