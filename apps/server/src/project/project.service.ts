import { Ability } from '@casl/ability'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { Action } from 'src/casl/actions'
import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'

import { Project } from 'src/project/entities/project.entity'
import { UserEntity } from 'src/user/entities/user.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'

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

  async create(data: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        organisation: {
          connect: { id: data.organisationId },
        },
      },
    })

    return new Project(project)
  }

  async update(id: number, data: UpdateProjectDto, user: UserEntity) {
    const ability = new Ability(user.abilities)

    const project = await this.findOne(id, user)

    //this.slack.postMessage({ text: 'hi', channel: 'recruitment-app' })

    if (!ability.can(Action.Update, new Project(project))) throw new ForbiddenException()

    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    })
  }
}
