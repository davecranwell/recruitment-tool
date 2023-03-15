import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { Action } from 'src/casl/actions'
import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'

import { Pipeline } from 'src/pipeline/entities/pipeline.entity'
import { UserEntity } from 'src/user/entities/user.entity'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class PipelineService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number, user: UserEntity) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    })
    if (!pipeline) throw new NotFoundException('Pipeline with this ID does not exist')

    if (!user.abilities.can(Action.Read, new Pipeline(pipeline))) throw new ForbiddenException()

    return new Pipeline(pipeline)
  }
}
