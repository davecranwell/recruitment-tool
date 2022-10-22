import { Global, Module } from '@nestjs/common'

import { CaslPermissions } from './casl.permissions'

@Global()
@Module({
  providers: [CaslPermissions],
  exports: [CaslPermissions],
})
export class CaslModule {}
