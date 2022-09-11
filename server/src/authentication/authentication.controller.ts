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
import { ExtractJwt, Strategy } from 'passport-jwt'

import { PrismaClassSerializerInterceptorPaginated } from 'src/class-serializer-paginated.interceptor'
import { LowerCasePipe } from 'src/app.pipes'
import { UserEntity } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

import { RegisterDto, RegisterFromInvitationDto } from './dto/register.dto'
import { LoginResponseDto, LoginDto, MagicLoginDto, GoogleAuthDto } from './dto/login.dto'

import { AuthenticationService } from './authentication.service'
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard'
import JwtAuthenticationGuard from './guards/jwtAuthentication.guard'
import JwtRefreshGuard from './guards/jwtRefresh.guard'
import { MagicLinkGuard } from './guards/magiclink.guard'
import { InvitationCodeGuardBody } from './guards/invitationCode.guard'
import { GoogleAuthenticationService } from './googleAuthentication.service'
export interface RequestWithUser extends Request {
  user: UserEntity
}

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  // private async registerAccount(registrationData: RegisterDto) {
  //   return this.authenticationService.register(registrationData)
  // }

  // @ApiOkResponse({ type: UserEntity })
  // @UsePipes(new LowerCasePipe('body', ['email']))
  // @Post('register')
  // @UseInterceptors(ClassSerializerInterceptor)
  // async register(@Body() registrationData: RegisterDto) {
  //   return new UserEntity(await this.registerAccount(registrationData))
  // }

  @ApiOkResponse({ type: LoginResponseDto })
  @Post('register/invitation')
  @UseGuards(InvitationCodeGuardBody)
  @UseInterceptors(ClassSerializerInterceptor)
  async acceptInvitation(@Req() request, @Body() registrationData: RegisterFromInvitationDto) {
    const { user: invitation } = request

    const registeredUser = await this.authenticationService.registerFromInvitation(invitation, registrationData)

    // Immediately log in. Invitations are by email so we've already verified their email is real.
    return await this.authenticationService.signInById(registeredUser.id)
  }

  @ApiOkResponse({ type: LoginResponseDto })
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(PrismaClassSerializerInterceptorPaginated(LoginResponseDto))
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request

    return await this.authenticationService.signInById(user.id)
  }

  //@ApiOkResponse({ type: LoginResponseDto })
  //@UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('log-in/google')
  async logInGoogle(@Body() body: GoogleAuthDto) {
    return await this.googleAuthenticationService.signinWithGoogle(body.code)
  }

  @ApiOkResponse()
  @ApiBearerAuth('access-token')
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

  // @Post('log-in/magic')
  // async magicLogin(@Body() { email }: MagicLoginDto) {
  //   return this.authenticationService.sendMagicLink(email)
  // }

  // @UseGuards(MagicLinkGuard)
  // @ApiQuery({ name: 'token', type: 'string' })
  // @ApiOkResponse({ type: UserEntity })
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('log-in/magic/callback')
  // async magicLoginCallback(@Req() request: RequestWithUser) {
  //   const { user } = request

  //   // if no user found, they're newly registering for the first time
  //   if (!user.id) {
  //     request.user = await this.registerAccount({
  //       email: user.email,
  //       password: null,
  //     })
  //   }

  //   return this.logIn(request)
  // }
}
