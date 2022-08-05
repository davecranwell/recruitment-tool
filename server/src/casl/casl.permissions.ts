import { Ability } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { Project } from 'src/project/entities/project.entity'
import { PrismaService } from 'src/prisma/prisma.service'

import { UserEntity } from 'src/user/entities/user.entity'

import { Action } from './actions'

// type Subjects = 'Organisation' | 'Position' | 'User' | 'all'

// export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslPermissions {
  constructor(private prismaService: PrismaService) {}

  async asJsonForUser(user: UserEntity) {
    const orgIdsOwned: number[] =
      user?.organisations?.filter((org) => org.role === 'ORGANISATION_OWNER').map((orgs) => orgs.organisationId) || []

    const orgIdsMember: number[] = user?.organisations?.map((orgs) => orgs.organisationId) || []

    const getProjectIds: Project[] = await this.prismaService.project.findMany({
      include: { userRoles: { where: { userId: user?.id } } },
      where: {
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
    })

    const projectIdsManaged = getProjectIds
      .filter((project) => project.userRoles.every((role) => role.role === 'HIRING_MANAGER'))
      .map((project) => project.id)

    const projectIdsRead = getProjectIds
      .filter((project) => project.userRoles.every((role) => role.role === 'INTERVIEWER'))
      .map((project) => project.id)

    return [
      {
        action: Action.Read,
        subject: 'Organisation',
        conditions: { id: { $in: orgIdsMember } },
      },
      {
        action: Action.Manage,
        subject: 'Organisation',
        conditions: { id: { $in: orgIdsOwned } },
      },
      {
        action: Action.Create,
        subject: 'Organisation',
      },
      {
        action: Action.Update,
        subject: 'Organisation',
        conditions: { id: { $in: orgIdsOwned } },
      },
      {
        action: Action.Manage,
        subject: 'Project',
        conditions: { organisationId: { $in: orgIdsOwned } },
      },
      {
        action: Action.Manage,
        subject: 'Project',
        conditions: { id: { $in: projectIdsManaged } },
      },
      {
        action: Action.Create,
        subject: 'Project',
        conditions: { organisationId: { $in: orgIdsOwned } },
      },
      {
        action: Action.Read,
        subject: 'Project',
        conditions: { id: { $in: projectIdsRead } },
      },
      {
        action: Action.Manage,
        subject: 'Position',
        conditions: {
          projectId: { $in: projectIdsManaged },
        },
      },
      {
        action: Action.Manage,
        subject: 'Position',
        conditions: { organisationId: { $in: orgIdsOwned } } as any,
      },
      {
        action: Action.Read,
        subject: 'Position',
        conditions: { projectId: { $in: projectIdsRead } } as any,
      },
      {
        action: Action.Create,
        subject: 'Position',
        conditions: { projectId: { $in: projectIdsManaged } },
      },
      {
        action: Action.Create,
        subject: 'Position',
        conditions: { 'project.organisationId': { $in: orgIdsOwned } },
      },
      {
        action: Action.Read,
        subject: 'Position',
        conditions: { projectId: { $in: projectIdsRead } },
      },
      {
        action: Action.Update,
        subject: 'Position',
        conditions: {
          projectId: { $in: projectIdsManaged },
        },
      },
      {
        action: Action.Manage,
        subject: 'UserEntity',
        conditions: {
          organisations: {
            $elemMatch: { organisationId: { $in: orgIdsOwned } },
          },
        },
      },
      {
        action: Action.Read,
        subject: 'UserEntity',
        conditions: { id: user.id },
      },
      {
        action: Action.Manage,
        subject: 'ApplicantProfile',
        conditions: { userId: user.id },
      },
      {
        action: Action.Review,
        subject: 'ApplicantProfileForPositionWithStage',
        conditions: { 'position.organisationId': { $in: orgIdsOwned } },
      },
      {
        action: Action.Review,
        subject: 'ApplicantProfileForPositionWithStage',
        conditions: { positionId: { $in: projectIdsManaged } },
      },
    ]
  }

  async createForUser(user: UserEntity) {
    return new Ability(await this.asJsonForUser(user))
  }
}
