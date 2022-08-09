import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Auth, google } from 'googleapis'

import { UserService } from '../user/user.service'
import { PostgresErrorCode } from '../util/db-types'
import { AuthenticationService } from './authentication.service'

type OAuthExchangedTokens = {
  access_token: string
  refresh_token: string
  token_type: string
  id_token: string
  expiry_date: number
}

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

    this.oauthClient = new google.auth.OAuth2(clientId, clientSecret, 'postmessage')
  }

  async signinWithGoogle(code: string) {
    //exchange code for access_token and refresh token
    const { tokens } = await this.oauthClient.getToken(code)

    this.oauthClient.setCredentials(tokens)

    const { email } = await this.oauthClient.getTokenInfo(tokens.access_token)

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

      const newUser = await this.register(tokens, email)

      return this.authenticationService.signInById(newUser.id)
    }
  }

  public async register(tokens: Auth.Credentials, email: string) {
    const userData = await this.getUserData()
    const { name, picture } = userData

    try {
      return await this.userService.create({
        email,
        name,
        avatarUrl: picture,
        isRegisteredWithGoogle: true,
        OAuth2Tokens: tokens,
      })
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists')
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getUserData() {
    const userInfoClient = google.oauth2('v2').userinfo

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    })

    return userInfoResponse.data
  }
}
