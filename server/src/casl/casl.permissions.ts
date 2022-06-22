import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { Organisation } from 'src/organisation/entities/organisation.entity'
import { Position } from 'src/position/entities/position.entity'

import { Action } from './actions'

type Subjects = InferSubjects<typeof Organisation | typeof Position | typeof User> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslPermissions {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

    const orgIdsOwned = user.organisations
      .filter((org) => org.role === 'ORGANISATION_OWNER')
      .map((orgs) => orgs.organisationId)

    const orgIdsMember = user.organisations.map((orgs) => orgs.organisationId)

    // Manage only orgs of which they're the owner
    can(Action.Manage, Organisation, {
      id: {
        $in: orgIdsOwned,
      },
    })

    // Read any org to which they belong
    can(Action.Read, Organisation, {
      id: {
        $in: orgIdsMember,
      },
    })

    // Create any org
    can(Action.Create, Organisation)

    // Update only orgs of which they're the owner
    can(Action.Update, Organisation, {
      id: {
        $in: orgIdsOwned,
      },
    })

    can(Action.Manage, Position, {
      userRoles: {
        $elemMatch: { role: 'HIRING_MANAGER', userId: user.id },
      },
    })

    can(Action.Manage, Position, {
      organisationId: {
        $in: orgIdsOwned,
      },
    })

    can(Action.Create, Position, {
      organisationId: {
        $in: orgIdsMember,
      },
    })

    // Read any position to which they're assigned in some way
    can(Action.Read, Position, {
      userRoles: {
        $elemMatch: { userId: user.id },
      },
    })

    // Update any position to which they're assigned as a HIRING_MANAGER
    can(Action.Update, Position, {
      userRoles: {
        $elemMatch: { role: 'HIRING_MANAGER', userId: user.id },
      },
    })

    can(Action.Manage, User, {
      organisations: {
        $elemMatch: { organisationId: { $in: orgIdsOwned } },
      },
    })

    can(Action.Read, User, {
      id: user.id,
    })

    // View sensitive position information if they're the Hiring manager of those positions

    // if (user.organisations.) {
    //   can(Action.Manage, 'all') // read-write access to everything
    // } else {
    //   can(Action.Read, 'all') // read-only access to everything
    // }

    // can(Action.Update, Organisation, { authorId: user.id })
    // cannot(Action.Delete, Organisation, { isPublished: true })

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
