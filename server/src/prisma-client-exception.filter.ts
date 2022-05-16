import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Prisma } from '@prisma/client'
import { Response } from 'express'

import { PostgresErrorCode } from 'src/util/db-types'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    switch (exception?.code) {
      case PostgresErrorCode.RecordDependencyFailed:
      case PostgresErrorCode.UniqueViolation:
        response
          .status(HttpStatus.BAD_REQUEST)
          .json({ statusCode: HttpStatus.CONFLICT, message: exception.message.replace(/\n/g, '') })
        break
      default:
        super.catch(exception, host)
        break
    }
  }
}
