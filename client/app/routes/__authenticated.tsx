import React from 'react'
import { Outlet, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { Ability } from '@casl/ability'

import { requireAuth, getSessionFromCookie, commitSession } from 'app/sessions.server'

import Layout from '~/components/Layout'
import { AbilityProvider } from '~/hooks/useAppAbility'

export async function loader({ request }: { request: Request }) {
  const { sessionData, session } = await requireAuth(request)

  const globalMessage = session.get('global')

  return json(
    { sessionData, globalMessage },
    // this can't happen here because if a subroute loads the session as this route saves it, the file appears corrupted
    { headers: { 'Set-Cookie': await commitSession(session) } }
  )
}

// TODO load abilities from the loader, not the session cookie (which is nearing its max size)
export default function Authenticated() {
  const { sessionData, globalMessage } = useLoaderData()
  const abilities = new Ability(sessionData.user.abilities)

  return (
    <AbilityProvider abilities={abilities}>
      <React.StrictMode>
        <Layout sessionData={sessionData} globalMessage={globalMessage}>
          <Outlet context={sessionData} />
        </Layout>
      </React.StrictMode>
    </AbilityProvider>
  )
}
