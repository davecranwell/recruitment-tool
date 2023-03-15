import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RequestWithUser } from 'src/authentication/authentication.controller'
import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard'

import { Pipeline } from './entities/pipeline.entity'
import { PipelineService } from './pipeline.service'

@ApiTags('Pipelines')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get information about one pipeline' })
  @ApiOkResponse({ type: Pipeline })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Req() request: RequestWithUser,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number
  ) {
    return this.pipelineService.findOne(+id, request.user)
  }
}
