import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
  PlainLiteralObject,
  Type,
} from '@nestjs/common'
import { ClassTransformOptions, plainToClass } from 'class-transformer'
import { map, Observable } from 'rxjs'
import { Action } from './casl/actions'
import { CaslPermissions } from './casl/casl.permissions'

import { PaginatedResult } from './util/pagination'

const isResponsePaginated = (response) => response.data && response.meta

export function PrismaClassSerializerInterceptorPaginated(classToIntercept: Type): typeof ClassSerializerInterceptor {
  @Injectable()
  class Interceptor extends ClassSerializerInterceptor {
    @Inject(CaslPermissions) private readonly caslPermissions

    private static permissions: any

    changePlainObjectToClass(response: PlainLiteralObject) {
      if (Interceptor?.permissions?.can(Action.Manage, plainToClass(classToIntercept, response))) {
        return plainToClass(classToIntercept, response, { groups: ['manager'] })
      } else {
        return plainToClass(classToIntercept, response)
      }
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
      const { user } = context.switchToHttp().getRequest()

      if (user) {
        Interceptor.permissions = this.caslPermissions.createForUser(user)
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
      if (isResponsePaginated(response)) {
        const res = response as PaginatedResult<typeof classToIntercept>

        res.data = res.data.map(this.changePlainObjectToClass)

        return response
      }

      return Array.isArray(response)
        ? response.map(this.changePlainObjectToClass)
        : this.changePlainObjectToClass(response)
    }
  }

  return mixin(Interceptor)
}
