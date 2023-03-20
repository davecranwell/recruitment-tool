import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

// import { FileServiceController } from './file-service.controller'
import { FileServiceService } from './file-service.service'

@Module({
  imports: [ConfigModule],
  // controllers: [FileServiceController],
  providers: [FileServiceService],
  exports: [FileServiceService],
})
export class FileServiceModule {}
