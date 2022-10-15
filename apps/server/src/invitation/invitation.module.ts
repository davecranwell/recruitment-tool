import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { InvitationService } from './invitation.service'
import { InvitationController } from './invitation.controller'
import { InvitationCodeStrategyByQuery } from './strategies/invitationCode.strategy'

@Module({
  imports: [
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
  controllers: [InvitationController],
  providers: [InvitationService, InvitationCodeStrategyByQuery],
  exports: [InvitationService],
})
export class InvitationModule {}
