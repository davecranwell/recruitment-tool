import { Ability } from '@casl/ability'
import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  mixin,
  PlainLiteralObject,
  Type,
} from '@nestjs/common'
import { ClassTransformOptions, plainToClass } from 'class-transformer'
import { map, Observable } from 'rxjs'

import { PaginatedResult } from 'src/util/pagination'

import { Action } from './casl/actions'

const isResponsePaginated = (response) => response && response.data && response.meta

export function PrismaClassSerializerInterceptorPaginated(classToIntercept: Type): typeof ClassSerializerInterceptor {
  @Injectable()
  class Interceptor extends ClassSerializerInterceptor {
    private static user: any

    changePlainObjectToClass(response: PlainLiteralObject, abilities: Ability) {
      const canManage = abilities.can(Action.Manage, plainToClass(classToIntercept, response))
      const canReview = abilities.can(Action.Review, plainToClass(classToIntercept, response))

      const groups = []
      canManage && groups.push('manage')
      canReview && groups.push('review')

      return plainToClass(classToIntercept, response, { groups })
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
      const { user } = context.switchToHttp().getRequest()

      if (user) {
        Interceptor.user = user
      }

      const contextOptions = this.getContextOptions(context)
      const options = {
        ...this.defaultOptions,
        ...contextOptions,
      }
      return next
        .handle()
        .pipe(map((res: PlainLiteralObject | Array<PlainLiteralObject>) => this.serialize(res, options)))
    }

    serialize(
      response: PaginatedResult<typeof classToIntercept> | PlainLiteralObject | Array<PlainLiteralObject>,
      options: ClassTransformOptions
    ): PaginatedResult<typeof classToIntercept> | PlainLiteralObject | Array<PlainLiteralObject> {
      const abilities = Interceptor.user.abilities

      if (isResponsePaginated(response)) {
        const res = response as PaginatedResult<typeof classToIntercept>

        res.data = res.data.map((datum) => this.changePlainObjectToClass(datum, abilities))

        return response
      }

      return Array.isArray(response)
        ? response.map((datum) => this.changePlainObjectToClass(datum, abilities))
        : this.changePlainObjectToClass(response, abilities)
    }
  }

  return mixin(Interceptor)
}
