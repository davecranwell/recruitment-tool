import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PaginationArgsDto } from 'src/page/pagination-args.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FileServiceService } from '~/file-service/file-service.service'
import { UserEntity } from 'src/user/entities/user.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { createPaginator } from 'src/util/pagination'

import { Position } from 'src/position/entities/position.entity'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { PatchOrganisationUserDto } from './dto/patch-organisation-user.dto'
import { Organisation } from './entities/organisation.entity'

import { Action } from 'src/casl/actions'
import { Project } from 'src/project/entities/project.entity'
import { Pipeline } from '~/pipeline/entities/pipeline.entity'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class OrganisationService {
  constructor(private prisma: PrismaService, private fileService: FileServiceService) {}

  async create(data: CreateOrganisationDto, user: UserEntity) {
    // Creation needs to happen in multiple awkward steps since an org, it's default project and
    // that project's default pipeline all have to be connected up.
    // We use an Interaction Transaction to achieve this https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide?query=&page=1#interactive-transactions
    return await this.prisma.$transaction(async (tx) => {
      const newOrg = await tx.organisation.create({
        data: {
          name: data.name,
          machineName: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          users: {
            create: [
              {
                userId: user.id,
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
        include: {
          projects: true,
        },
      })

      await tx.pipeline.create({
        data: {
          name: 'Default pipeline',
          projects: {
            connect: {
              id: newOrg.projects[0].id,
            },
          },
          organisation: {
            connect: {
              id: newOrg.id,
            },
          },
          stages: {
            create: [
              { name: 'Review', order: 1 },
              { name: 'Stage 1', order: 2 },
              { name: 'Stage 2', order: 3 },
              { name: 'Offer', order: 4 },
              { name: 'Disqualified', order: 5 },
            ],
          },
        },
      })

      return new Organisation(newOrg)
    })
  }

  async patchOrganisationLogo(organisationId: number, file: Express.Multer.File) {
    const uploadResult = await this.fileService.upload(file, 'public')
    if (uploadResult) {
      const { key, bucket } = uploadResult
      return await this.prisma.file.create({
        data: {
          key,
          bucket,
          organisation: {
            connect: {
              id: organisationId,
            },
          },
        },
      })
    }
  }

  async findUsers(organisationId: number, paginationArgs: PaginationArgsDto) {
    const userOrgs = await paginate<UsersInOrganisation, Prisma.UsersInOrganisationFindFirstArgs>(
      this.prisma.usersInOrganisation,
      { where: { organisationId }, include: { user: true } },
      { ...paginationArgs }
    )
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

  async findPipelines(organisationId: number, user: UserEntity, paginationArgs: PaginationArgsDto) {
    return await paginate<Pipeline, Prisma.PipelineFindManyArgs>(
      this.prisma.pipeline,
      {
        where: {
          organisationId,
        },
      },
      { ...paginationArgs }
    )
  }

  async findProjects(organisationId: number, user: UserEntity, paginationArgs: PaginationArgsDto) {
    // if you're an org admin, get all projects
    // if you're a regular user, get all projects you're allocated to in some way
    const isOrgOwner = user.abilities.can(Action.Manage, new Organisation({ id: organisationId }))

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
                  in: ['HIRING_MANAGER', 'INTERVIEWER', 'FINANCIAL_MANAGER'],
                },
              },
            },
          }),
        },
        include: {
          _count: {
            select: {
              positions: {
                ...(!isOrgOwner && {
                  where: {
                    OR: [
                      {
                        project: {
                          userRoles: {
                            some: {
                              userId: user.id,
                              role: {
                                in: ['FINANCIAL_MANAGER'],
                              },
                            },
                          },
                        },
                      },
                      {
                        approved: true,
                        project: {
                          userRoles: {
                            some: {
                              userId: user.id,
                              role: {
                                in: ['HIRING_MANAGER', 'INTERVIEWER'],
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                }),
              },
            },
          },
        },
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
    const isOrgOwner = user.abilities.can(Action.Manage, new Organisation({ id: organisationId }))
    const isFinancialManager = user.abilities.can(Action.Approve, new Position({ projectId }))

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
          ...(!isOrgOwner && !isFinancialManager && { approved: true }),
          ...(!isOrgOwner && {
            project: {
              userRoles: {
                some: {
                  userId: user.id,
                  role: {
                    // TODO: we're specifying these so that other roles in the project (like an interviewee) can't see the wrong stuff
                    in: ['HIRING_MANAGER', 'INTERVIEWER', 'FINANCIAL_MANAGER'],
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
    if (user.abilities.can(Action.Manage, new Organisation({ id: organisationId }))) {
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
                  in: ['HIRING_MANAGER', 'INTERVIEWER', 'FINANCIAL_MANAGER'],
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
    const record = await this.prisma.organisation.findUnique({ where: { id }, include: { logo: true } })
    if (!record) throw new NotFoundException('Organisation with this ID does not exist')
    return new Organisation(record)
  }
}
