import type { MetaFunction } from '@remix-run/node'
import type { RouteMatch } from '@remix-run/react'
import { Link, Outlet, useMatches } from '@remix-run/react'

import Breadcrumb from '~/components/Breadcrumb'
import ContentBanner from '~/components/ContentBanner'

export const handle = {
  breadcrumb: (match: RouteMatch) => <Link to={match.pathname}>Positions</Link>,
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Positions at ${data?.sessionData?.activeOrganisation?.name}` }
}

const Positions = () => {
  const matches = useMatches()

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
