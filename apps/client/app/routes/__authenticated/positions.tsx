import type { MetaFunction } from '@remix-run/node'
import type { RouteMatch } from '@remix-run/react'
import { useMatches } from '@remix-run/react'
import { Link, Outlet, useOutletContext } from '@remix-run/react'

import type { SessionData } from '~/sessions.server'

import { useAppAbility } from 'app/hooks/useAppAbility'
import ContentBanner from '~/components/ContentBanner'
import Breadcrumb from '~/components/Breadcrumb'

export const handle = {
  breadcrumb: (match: RouteMatch) => <Link to={match.pathname}>Positions</Link>,
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Positions at ${data?.sessionData?.activeOrganisation?.name}` }
}

const Positions = () => {
  const matches = useMatches()
  const sessionData = useOutletContext<SessionData>()
  const { can, subject } = useAppAbility()

  const canCreateProject = can('create', subject('Organisation', sessionData?.activeOrganisation))

  return (
    <div className="space-y-4">
      <ContentBanner title={'Positions'} titleLink={'/positions'}>
        <Breadcrumb matches={matches} />
      </ContentBanner>
      <Outlet />
    </div>
  )
}
export default Positions
