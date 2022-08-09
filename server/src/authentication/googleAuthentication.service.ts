import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Auth, google } from 'googleapis'

import { UserService } from '../user/user.service'
import { PostgresErrorCode } from '../util/db-types'
import { AuthenticationService } from './authentication.service'

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    const clientId = this.configService.get('GOOGLE_AUTH_CLIENT_ID')
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET')

    this.oauthClient = new google.auth.OAuth2(clientId, clientSecret)
  }

  public async register(token: string, email: string) {
    const userData = await this.getUserData(token)

    console.log(userData)
    const { name, picture } = userData

    try {
      return await this.userService.create({
        email,
        name,
        avatarUrl: picture,
        isRegisteredWithGoogle: true,
      })
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists')
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async signinWithGoogle(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token)

    const email = tokenInfo.email

    try {
      const user = await this.userService.getByEmail(email)

      if (!user.isRegisteredWithGoogle) {
        throw new UnauthorizedException()
      }

      return this.authenticationService.signInById(user.id)
    } catch (error) {
      if (error.status !== 404) {
        throw new error()
      }

      const newUser = await this.register(token, email)

      return this.authenticationService.signInById(newUser.id)
    }
    return tokenInfo
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo

    this.oauthClient.setCredentials({
      access_token: token,
    })

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    })

    return userInfoResponse.data
  }
}
