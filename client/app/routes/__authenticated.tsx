import { Outlet, useLoaderData } from '@remix-run/react'
import { Ability } from '@casl/ability'

import { requireAuth } from 'app/sessions.server'

import Layout from '~/components/Layout'
import { AbilityProvider } from '~/hooks/useAppAbility'

export async function loader({ request }: { request: Request }) {
  return await requireAuth(request)
}

export default function Authenticated() {
  const session = useLoaderData()
  const abilities = new Ability(session.abilities)

  return (
    <div>
      <AbilityProvider abilities={abilities}>
        <Layout session={session}>
          <Outlet context={session} />
        </Layout>
      </AbilityProvider>
    </div>
  )
}
