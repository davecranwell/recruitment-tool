import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { AuthenticationService } from 'src/authentication/authentication.service'
import { UserEntity } from 'src/user/entities/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    })
  }
  async validate(email: string, password: string): Promise<UserEntity> {
    return this.authenticationService.authenticateEmailPassword(email, password)
  }
}
