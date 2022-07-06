import { createContext } from 'react'
import { useAbility } from '@casl/react'
import { createContextualCan } from '@casl/react'
import type { Ability } from '@casl/ability'
import { subject } from '@casl/ability'

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'publish'
type Subjects = 'Organisation' | 'User' | 'Position' | 'Projects'

export type AppAbility = Ability<[Actions, Subjects]>

export const AbilityContext = createContext<AppAbility>(null as unknown as AppAbility)

export const AbilityProvider = (props: { abilities: any; children: React.ReactNode }) => (
  <AbilityContext.Provider value={props.abilities}>{props.children}</AbilityContext.Provider>
)

export default createContextualCan(AbilityContext.Consumer)

export const useAppAbility = () => {
  const abilities = useAbility(AbilityContext)

  abilities.can = abilities.can.bind(abilities)
  abilities.cannot = abilities.cannot.bind(abilities)

  const { can, cannot } = abilities

  return { can, cannot, subject }
}
