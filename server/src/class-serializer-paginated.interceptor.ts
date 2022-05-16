import { ClassSerializerInterceptor, PlainLiteralObject, Type } from '@nestjs/common'
import { plainToClass, ClassTransformOptions } from 'class-transformer'

import { PaginatedResult } from './util/pagination'

const isResponsePaginated = (response) => response.data && response.meta

export function PrismaClassSerializerInterceptorPaginated(classToIntercept: Type): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private static changePlainObjectToClass(response: PlainLiteralObject) {
      return plainToClass(classToIntercept, response)
    }

    private static prepareResponse(
      response: PaginatedResult<typeof classToIntercept> | PlainLiteralObject | PlainLiteralObject[]
    ) {
      if (isResponsePaginated(response)) {
        const res = response as PaginatedResult<typeof classToIntercept>

        res.data = res.data.map(Interceptor.changePlainObjectToClass)

        return response
      }

      if (Array.isArray(response)) {
        return response.map(Interceptor.changePlainObjectToClass)
      }

      return Interceptor.changePlainObjectToClass(response)
    }

    serialize(
      response: PaginatedResult<typeof classToIntercept> | PlainLiteralObject | Array<PlainLiteralObject>,
      options: ClassTransformOptions
    ): PaginatedResult<typeof classToIntercept> | PlainLiteralObject | Array<PlainLiteralObject> {
      return super.serialize(Interceptor.prepareResponse(response), options)
    }
  }
}
