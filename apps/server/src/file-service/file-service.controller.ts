import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'

import { RequestWithUser } from '~/authentication/authentication.controller'
import { FileServiceService } from '~/file-service/file-service.service'

@Controller('fileservice')
export class FileServiceController {
  constructor(private readonly fileService: FileServiceService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post()
  async create(
    @Req() request: RequestWithUser,
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        exceptionFactory(error) {
          throw new BadRequestException('The uploaded file must be less than 1MB in size, and of the format jpg/png')
        },
      })
    )
    file: Express.Multer.File
  ) {
    return this.fileService.uploadPublic(file)
  }
}
