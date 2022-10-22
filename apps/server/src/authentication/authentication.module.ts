import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { CaslModule } from 'src/casl/casl.module'
import { UserModule } from 'src/user/user.module'
import { AuthenticationService } from './authentication.service'
import { GoogleAuthenticationService } from './googleAuthentication.service'
import { AuthenticationController } from './authentication.controller'
import { InvitationService } from 'src/invitation/invitation.service'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshTokenStrategy } from './strategies/jwtRefreshToken.strategy'
import { MagicLinkStrategy } from './strategies/magicLink.strategy'
import { InvitationCodeStrategyByBody } from './strategies/invitationCode.strategy'
@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  providers: [
    AuthenticationService,
    GoogleAuthenticationService,
    InvitationService,
    LocalStrategy,
    JwtStrategy,
    MagicLinkStrategy,
    JwtRefreshTokenStrategy,
    InvitationCodeStrategyByBody,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, GoogleAuthenticationService],
})
export class AuthenticationModule {}
