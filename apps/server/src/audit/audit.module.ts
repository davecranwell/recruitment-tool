import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '~/prisma/prisma.module'

import { AuditService } from './audit.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
