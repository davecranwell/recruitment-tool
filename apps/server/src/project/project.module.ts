import { Module } from '@nestjs/common'

import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
// import { SlackModule } from 'nestjs-slack'

@Module({
  // imports: [SlackModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
