import {
  Body,
  Req,
  Res,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { User } from '@prisma/client'

import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'

import { AuthenticationService } from './authentication.service'
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard'
import JwtAuthenticationGuard from './guards/jwtAuthentication.guard'
import { UserEntity } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import JwtRefreshGuard from './guards/jwtRefresh.guard'
import { LowerCasePipe } from 'src/app.pipes'
import RegisterDto from './dto/register.dto'
import { LoginResponseDto, LoginDto, MagicLoginDto } from './dto/login.dto'
import { MagicLinkGuard } from './guards/magiclink.guard'
import { ThrottlerGuard } from '@nestjs/throttler'
export interface RequestWithUser extends Request {
  user: User
}
@ApiTags('Authentication')
// @UseGuards(ThrottlerGuard)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  private async registerAccount(registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData)
  }

  @ApiOkResponse({ type: UserEntity })
  @UsePipes(new LowerCasePipe('body', ['email']))
  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registrationData: RegisterDto) {
    return new UserEntity(await this.registerAccount(registrationData))
  }

  @ApiOkResponse({ type: LoginResponseDto })
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(LoginResponseDto))
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser): Promise<{ accessToken: string; refreshToken: string }> {
    const { user } = request

    const { token: accessToken, cookie: accessTokenCookie } = this.authenticationService.getJwtToken(user.id)
    const { token: refreshToken, cookie: refreshTokenCookie } = this.authenticationService.getJwtRefreshToken(user.id)

    await this.userService.setRefreshToken(refreshToken, user.id)

    //request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])

    return <LoginResponseDto>{ user, accessToken, refreshToken }
  }

  @ApiOkResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request
    await this.userService.removeRefreshToken(user.id)
    const cookie = this.authenticationService.getCookiesForLogOut()

    //request.res.setHeader('Set-Cookie', cookie)

    return response.sendStatus(200)
  }

  @ApiBearerAuth('refresh-token')
  @ApiResponse({ type: LoginResponseDto })
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    /**
     * If we refresh the access token without also refreshing the refresh
     * token, then when the refresh token expires, full logout will occur.
     *
     * By fully logging in again, we can create permanent logins that are also
     * revokable by invalidating the refresh token hash in the database
     */
    return this.logIn(request)
  }

  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  authenticate(@Req() { user }: RequestWithUser) {
    return new UserEntity(user)
  }

  @Post('log-in/magic')
  async magicLogin(@Body() { email }: MagicLoginDto) {
    return this.authenticationService.sendMagicLink(email)
  }

  @UseGuards(MagicLinkGuard)
  @ApiQuery({ name: 'token', type: 'string' })
  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('log-in/magic/callback')
  async magicLoginCallback(@Req() request: RequestWithUser) {
    const { user } = request

    // if no user found, they're newly registering for the first time
    if (!user.id) {
      request.user = await this.registerAccount({
        email: user.email,
        password: null,
      })
    }

    return this.logIn(request)
  }
}
