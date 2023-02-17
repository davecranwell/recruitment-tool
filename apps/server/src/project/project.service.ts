import { Ability } from '@casl/ability'
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ProjectRoleType, ProjectUserRole } from '@prisma/client'

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

    let { hiringManagers, interviewers } = data
    if (!Array.isArray(hiringManagers)) hiringManagers = [hiringManagers]
    if (!Array.isArray(interviewers)) interviewers = [interviewers]

    const allRoleUsers = [...hiringManagers, ...interviewers]

    // check the users provided are in the organisation
    const findUsers = await this.prisma.usersInOrganisation.findMany({
      where: {
        organisationId: project.organisationId,
        userId: { in: allRoleUsers },
      },
    })

    if (findUsers.length !== allRoleUsers.length) {
      throw new BadRequestException('One of the user IDs provided does not exist in this organisation')
    }

    const newManagersRoles = hiringManagers.map((user) => ({
      projectId: id,
      userId: user,
      role: ProjectRoleType.HIRING_MANAGER,
    }))
    const newInterviewersRoles = interviewers.map((user) => ({
      projectId: id,
      userId: user,
      role: ProjectRoleType.INTERVIEWER,
    }))

    // Perform the deletion of old and creation of new in a transaction
    const [deleted, created, updatedProject] = await this.prisma.$transaction([
      this.prisma.projectUserRole.deleteMany({
        where: { projectId: id },
      }),
      this.prisma.projectUserRole.createMany({
        data: [...newManagersRoles, ...newInterviewersRoles],
      }),
      this.prisma.project.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
        },
        include: { userRoles: { include: { user: { select: { name: true, avatarUrl: true } } } } },
      }),
    ])

    return new Project(updatedProject)
  }
}
