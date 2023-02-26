import { Ability } from '@casl/ability'
import type { PackRule } from '@casl/ability/extra'
import { unpackRules } from '@casl/ability/extra'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import React from 'react'

import { commitSession, requireAuth } from 'app/sessions.server'

import Layout from '~/components/Layout'
import { AbilityProvider } from '~/hooks/useAppAbility'

type Rule = {
  action: any
  subject: any
  conditions?: any
}

export async function loader({ request }: { request: Request }) {
  const { sessionData, session } = await requireAuth(request)

  const globalMessage = session.get('global')

  return json(
    { sessionData, globalMessage },
    // Setting headers here is problematic, if another fetch running in another route suddenly encounters a need
    // to generate new access tokens. How does that route commit the new tokens to the session, if this page is also committing
    // a new session at the same time.
    // this can't happen here because if a subroute loads the session as this route saves it, the file appears corrupted
    { headers: { 'Set-Cookie': await commitSession(session) } }
  )
}

// TODO load abilities from the loader, not the session cookie (which is nearing its max size)
export default function Authenticated() {
  const { sessionData, globalMessage } = useLoaderData()

  const abilities =
    sessionData?.user?.abilities && new Ability(unpackRules(sessionData.user.abilities as PackRule<Rule>[]))

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
