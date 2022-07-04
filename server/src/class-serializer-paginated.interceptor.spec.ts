import { PrismaClassSerializerInterceptorPaginated } from './class-serializer-paginated.interceptor'
import { UserEntity } from './user/entities/user.entity'

describe('ClassSerializerInterceptor', () => {
  it('should be defined', () => {
    expect(PrismaClassSerializerInterceptorPaginated(UserEntity)).toBeDefined()
  })
})
