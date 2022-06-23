import { Ability } from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { UserEntity as User } from 'src/user/entities/user.entity'

import { Action } from './actions'

// type Subjects = 'Organisation' | 'Position' | 'User' | 'all'

// export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslPermissions {
  asJsonForUser(user: User) {
    const orgIdsOwned: number[] =
      user?.organisations.filter((org) => org.role === 'ORGANISATION_OWNER').map((orgs) => orgs.organisationId) || []

    const orgIdsMember: number[] = user.organisations.map((orgs) => orgs.organisationId)

    return [
      {
        action: 'read',
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
        subject: 'Position',
        conditions: {
          userRoles: {
            $elemMatch: { role: 'HIRING_MANAGER', userId: user.id },
          },
        } as any,
      },
      {
        action: Action.Manage,
        subject: 'Position',
        conditions: { organisationId: { $in: orgIdsOwned } },
      },
      {
        action: Action.Create,
        subject: 'Position',
        conditions: {
          organisationId: {
            $in: orgIdsMember,
          },
        },
      },
      {
        action: Action.Read,
        subject: 'Position',
        conditions: {
          userRoles: {
            $elemMatch: { userId: user.id },
          },
        },
      },
      {
        action: Action.Update,
        subject: 'Position',
        conditions: {
          userRoles: {
            $elemMatch: { role: 'HIRING_MANAGER', userId: user.id },
          },
        },
      },
      {
        action: Action.Manage,
        subject: 'User',
        conditions: {
          organisations: {
            $elemMatch: { organisationId: { $in: orgIdsOwned } },
          },
        },
      },
      {
        action: Action.Read,
        subject: 'User',
        conditions: {
          id: user.id,
        },
      },
    ]
  }

  createForUser(user: User) {
    return new Ability(this.asJsonForUser(user))
  }
}
