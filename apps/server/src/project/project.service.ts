import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Ability } from '@casl/ability'

import { PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { Action } from 'src/casl/actions'

import { Project } from 'src/project/entities/project.entity'
import { UserEntity } from 'src/user/entities/user.entity'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number, user: UserEntity) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { userRoles: { include: { user: { select: { name: true, avatarUrl: true } } } } },
    })
    if (!project) throw new NotFoundException('Position with this ID does not exist')

    const ability = new Ability(user.abilities)

    if (!ability.can(Action.Read, new Project(project))) throw new ForbiddenException()

    return new Project(project)
  }
}
