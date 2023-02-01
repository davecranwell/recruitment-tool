import { createContext } from 'react'
import { useAbility } from '@casl/react'
import { createContextualCan } from '@casl/react'
import type { Ability, AnyAbility } from '@casl/ability'
import { subject } from '@casl/ability'

import type { Organisation } from '~/models/organisation/Organisation'

// type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'publish'
// type Subjects = 'Organisation' | 'User' | 'Position' | 'Projects' //| Organisation

// export type AppAbility = Ability<[Actions, Subjects]>

export const AbilityContext = createContext(null as unknown as AnyAbility)

export const AbilityProvider = (props: { abilities: any; children: React.ReactNode }) => (
  <AbilityContext.Provider value={props.abilities}>{props.children}</AbilityContext.Provider>
)

export const useAppAbility = () => {
  const abilities = useAbility(AbilityContext)

  abilities.can = abilities.can.bind(abilities)
  abilities.cannot = abilities.cannot.bind(abilities)
  abilities.possibleRulesFor = abilities.possibleRulesFor.bind(abilities)

  const { can, cannot, possibleRulesFor } = abilities

  return { can, cannot, subject, possibleRulesFor }
}
