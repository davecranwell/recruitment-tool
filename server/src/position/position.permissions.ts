import { InferSubjects, Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability'
import { Injectable } from '@nestjs/common'

import { UserEntity as User } from 'src/user/entities/user.entity'
import { Action } from 'src/casl/actions'

import { Position } from './entities/position.entity'

type Subjects = InferSubjects<typeof Position | typeof User> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class PositionPermissions {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)

    const orgIdsOwned = user.organisations
      .filter((org) => org.role === 'ORGANISATION_OWNER')
      .map((orgs) => orgs.organisationId)

    const orgIdsMember = user.organisations.map((orgs) => orgs.organisationId)

    // Manage (inc create) only positions of which they're the HIRING_MANAGER
    can(Action.Manage, Position, {
      userRoles: {
        $elemMatch: { role: 'HIRING_MANAGER', userId: user.id },
      },
    })

    // Manage (inc create) only positions for an organisation they own
    can(Action.Manage, Position, {
      organisationId: {
        $in: orgIdsOwned,
      },
    })

    // Read any position to which they're assigned in some way
    can(Action.Read, Position, {
      userRoles: {
        $elemMatch: { userId: user.id },
      },
    })

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
