import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import config from './config/configuration'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthenticationModule } from './authentication/authentication.module'
import { UsersModule } from './users/users.module'
import { UpdatesModule } from './updates/updates.module'
import { FooModule } from './foo/foo.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthenticationModule,
    UpdatesModule,
    UsersModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 1,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
