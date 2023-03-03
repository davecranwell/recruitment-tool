import { Ability } from '@casl/ability'
import { packRules } from '@casl/ability/extra'
import { Injectable } from '@nestjs/common'
import { Project } from 'src/project/entities/project.entity'
import { PrismaService } from 'src/prisma/prisma.service'

import { UserEntity } from 'src/user/entities/user.entity'

import { Action } from './actions'

@Injectable()
export class CaslPermissions {
  constructor(private prismaService: PrismaService) {}

  // TODO we may want to alter this so that not only is a user param supplied, but the organisation we care about also given
  // this would mean we don't have to concern ourselves with every entity, in every org all the time - only the one they're
  // currently operating in, which would be more limited, one would assume.
  //
  // This would however require that the task of changing organisation be something much more backend-related requiring a full reset of cookie/jwt
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
              // TODO: we're white listing these so that any lower sec roles created in future in the project can't see the wrong stuff
              in: ['HIRING_MANAGER', 'INTERVIEWER', 'FINANCIAL_MANAGER'],
            },
          },
        },
      },
    })

    const projectIdsManager = getProjectIds
      .filter((project) => project.userRoles.every((role) => role.role === 'HIRING_MANAGER'))
      .map((project) => project.id)

    const projectIdsRead = getProjectIds
      .filter((project) => project.userRoles.every((role) => role.role === 'INTERVIEWER'))
      .map((project) => project.id)

    const projectIdsFinancialManager = getProjectIds
      .filter((project) => project.userRoles.every((role) => role.role === 'FINANCIAL_MANAGER'))
      .map((project) => project.id)

    let perms = []

    if (orgIdsOwned.length) {
      perms = perms.concat([
        {
          action: [Action.Manage, Action.Update],
          subject: 'Organisation',
          conditions: { id: { $in: orgIdsOwned } },
        },
        {
          action: [Action.Manage, Action.Update, Action.Create, Action.Read],
          subject: 'Project',
          conditions: { organisationId: { $in: orgIdsOwned } },
        },
        {
          action: Action.Manage,
          subject: 'Position',
          conditions: { organisationId: { $in: orgIdsOwned } },
        },
        {
          action: Action.Create,
          subject: 'Position',
          conditions: { 'project.organisationId': { $in: orgIdsOwned } },
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
          // This is a weird one, but 'review' status is only used for viewing applicantProfile entities
          // if you don't have review status you can't see the salary of the applicant.
          action: Action.Review,
          subject: 'ApplicantProfileForPositionWithStage',
          conditions: { 'position.organisationId': { $in: orgIdsOwned } },
        },
      ])
    }

    if (projectIdsManager.length) {
      perms = perms.concat([
        {
          action: [Action.Manage, Action.Update, Action.Read],
          subject: 'Project',
          conditions: { id: { $in: projectIdsManager } },
        },
        {
          action: [Action.Manage, Action.Create, Action.Update],
          subject: 'Position',
          conditions: { projectId: { $in: projectIdsManager }, approved: true },
        },
        {
          // This is a weird one, but 'review' status is only used for viewing applicantProfile entities
          // if you don't have review status you can't see the salary of the applicant.
          action: Action.Review,
          subject: 'ApplicantProfileForPositionWithStage',
          conditions: { positionId: { $in: projectIdsManager } },
        },
      ])
    }

    if (projectIdsRead.length) {
      perms = perms.concat([
        {
          action: Action.Read,
          subject: 'Project',
          conditions: { id: { $in: projectIdsRead } },
        },
        {
          action: Action.Read,
          subject: 'Position',
          conditions: { projectId: { $in: projectIdsRead }, approved: true },
        },
      ])
    }

    // being a financial manager is like being an interviewer in that seeing projects is important
    // but approving them is your only major role.
    // Reading projects matters, but only for approving positions
    if (projectIdsFinancialManager.length) {
      perms = perms.concat([
        {
          action: Action.Read,
          subject: 'Project',
          conditions: { id: { $in: projectIdsFinancialManager } },
        },
        {
          action: [Action.Approve, Action.Read],
          subject: 'Position',
          conditions: { projectId: { $in: projectIdsFinancialManager } },
        },
      ])
    }

    // basic permissions that everyone should have
    perms = perms.concat([
      {
        action: Action.Read,
        subject: 'Organisation',
        conditions: { id: { $in: orgIdsMember } },
      },
      // {
      //   action: Action.Create,
      //   subject: 'Organisation',
      // },
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
    ])

    return perms
  }

  async asPackedForUser(user: UserEntity) {
    return packRules(await this.asJsonForUser(user))
  }

  async createForUser(user: UserEntity) {
    return new Ability(await this.asJsonForUser(user))
  }
}
