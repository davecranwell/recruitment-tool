import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Ability } from '@casl/ability'

import { PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from 'src/user/entities/user.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { createPaginator } from 'src/util/pagination'

import { Position } from 'src/position/entities/position.entity'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { PatchOrganisationUserDto } from './dto/patch-organisation-user.dto'
import { Organisation } from './entities/organisation.entity'

import { Action } from 'src/casl/actions'
import { Project } from 'src/project/entities/project.entity'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class OrganisationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrganisationDto) {
    return this.prisma.organisation.create({
      data: {
        name: data.name,
        machineName: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        users: {
          create: [
            {
              userId: data.userId,
              role: 'ORGANISATION_OWNER',
            },
          ],
        },
        projects: {
          create: [
            {
              name: 'Default project',
            },
          ],
        },
      },
    })
  }

  // findAll() {
  //   return `This action returns all organisation`
  // }

  async findUsers(organisationId: number, paginationArgs: PaginationArgsDto) {
    const userOrgs = await paginate<UsersInOrganisation, Prisma.UsersInOrganisationFindFirstArgs>(
      this.prisma.usersInOrganisation,
      { where: { organisationId }, include: { user: true } },
      { ...paginationArgs }
    )
    //;(userOrgs as unknown as PaginatedDto<UserEntity>).data = userOrgs.data.map((userOrg) => ({ ...userOrg.user }))
    return userOrgs
  }

  async findUser(organisationId: number, userId: number) {
    const user: UsersInOrganisation = await this.prisma.usersInOrganisation.findFirst({
      where: { organisationId, userId },
      include: { user: true },
    })
    if (!user) throw new NotFoundException('User with this ID does not exist in this organisation')
    return new UsersInOrganisation(user)
  }

  async patchUser(organisationId: number, userId: number, patchData: PatchOrganisationUserDto) {
    try {
      const user: UsersInOrganisation = await this.prisma.usersInOrganisation.update({
        where: {
          userId_organisationId: {
            userId,
            organisationId,
          },
        },
        data: {
          ...(patchData.name && {
            user: {
              update: {
                name: patchData.name,
              },
            },
          }),
          ...(patchData.role && { role: patchData.role }),
        },
      })
      return new UsersInOrganisation(user)
    } catch (e) {
      throw new NotFoundException('User with this ID does not exist in this organisation')
    }
  }

  async findProjects(organisationId: number, user: UserEntity, paginationArgs: PaginationArgsDto) {
    // if you're an org admin, get all projects
    // if you're a regular user, get all projects you're allocated to in some way
    const ability = new Ability(user.abilities)
    const isOrgOwner = ability.can(Action.Manage, new Organisation({ id: organisationId }))

    return await paginate<Project, Prisma.ProjectFindManyArgs>(
      this.prisma.project,
      {
        where: {
          organisationId,
          ...(!isOrgOwner && {
            userRoles: {
              some: {
                userId: user.id,
                role: {
                  // TODO: we're specifying these so that other roles in the project (like an interviewee) can't see the wrong stuff
                  in: ['HIRING_MANAGER', 'INTERVIEWER'],
                },
              },
            },
          }),
        },
        include: { _count: { select: { positions: true } } },
      },
      { ...paginationArgs }
    )
  }

  async findPositionsByProject(
    organisationId: number,
    projectId: number,
    user: UserEntity,
    paginationArgs: PaginationArgsDto
  ) {
    const ability = new Ability(user.abilities)
    const isOrgOwner = ability.can(Action.Manage, new Organisation({ id: organisationId }))

    const results = await paginate<Position, Prisma.PositionFindManyArgs>(
      this.prisma.position,
      {
        orderBy: {
          project: {
            name: 'asc',
          },
        },
        where: {
          organisationId,
          projectId,
          ...(!isOrgOwner && {
            project: {
              userRoles: {
                some: {
                  userId: user.id,
                  role: {
                    // TODO: we're specifying these so that other roles in the project (like an interviewee) can't see the wrong stuff
                    in: ['HIRING_MANAGER', 'INTERVIEWER'],
                  },
                },
              },
            },
          }),
        },
        include: { project: true },
      },
      { ...paginationArgs }
    )

    return results
  }

  async findPositions(organisationId: number, user: UserEntity, paginationArgs: PaginationArgsDto) {
    // if you're an org admin, get all positions
    // if you're a regular user, get all positions within the projects you're allocated to
    const ability = new Ability(user.abilities)
    if (ability.can(Action.Manage, new Organisation({ id: organisationId }))) {
      return await paginate<Position, Prisma.PositionFindManyArgs>(
        this.prisma.position,
        { where: { project: { organisationId } }, include: { project: true }, orderBy: { project: { name: 'asc' } } },
        { ...paginationArgs }
      )
    }

    const results = await paginate<Position, Prisma.PositionFindManyArgs>(
      this.prisma.position,
      {
        orderBy: {
          project: {
            name: 'asc',
          },
        },
        where: {
          organisationId,
          project: {
            userRoles: {
              some: {
                userId: user.id,
                role: {
                  // TODO: we're specifying these so that other roles in the project (like an interviewee) can't see the wrong stuff
                  in: ['HIRING_MANAGER', 'INTERVIEWER'],
                },
              },
            },
          },
        },
        include: { project: true },
      },
      { ...paginationArgs }
    )

    return results
  }

  async findOne(id: number) {
    const record = await this.prisma.organisation.findUnique({ where: { id } })
    if (!record) throw new NotFoundException('Organisation with this ID does not exist')
    return record
  }
}
