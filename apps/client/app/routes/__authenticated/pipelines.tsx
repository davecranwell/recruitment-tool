import type { MetaFunction } from '@remix-run/node'
import type { RouteMatch } from '@remix-run/react'
import { Link, Outlet, useMatches, useOutletContext } from '@remix-run/react'

import type { SessionData } from '~/sessions.server'

import { useAppAbility } from 'app/hooks/useAppAbility'
import ContentBanner from '~/components/ContentBanner'
import Breadcrumb from '~/components/Breadcrumb'

export const handle = {
  breadcrumb: (match: RouteMatch) => <Link to={match.pathname}>Projects</Link>,
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Projects at ${data?.sessionData?.activeOrganisation?.name}` }
}

const Pipelines = () => {
  const matches = useMatches()
  const sessionData = useOutletContext<SessionData>()

  const { can, subject } = useAppAbility()

  const canCreatePipeline = can('manage', subject('Organisation', sessionData?.activeOrganisation))

  return (
    <div className="space-y-4">
      <ContentBanner
        title={'Pipelines'}
        titleLink={'/pipeline'}
        primaryAction={
          canCreatePipeline && {
            label: 'Create a new pipeline',
            link: '/pipeline/new',
          }
        }
      >
        <Breadcrumb matches={matches} />
      </ContentBanner>
      <Outlet />
    </div>
  )
}
export default Pipelines
