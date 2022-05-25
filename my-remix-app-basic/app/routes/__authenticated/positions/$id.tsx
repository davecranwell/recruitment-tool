import { BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/solid'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/react/routeModules'

import { api } from 'app/api.server'
import Content from 'app/components/Content'
import Tabs from 'app/components/Tabs'
import { MetaList, MetaListItem } from '~/components/MetaList'
import { requireAuth } from '~/sessions.server'
import { dateTimeFormat } from '~/utils'
import type { Position } from '.'

export const meta: MetaFunction = ({ data }) => {
  return { title: data.name }
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  await requireAuth(request)
  return await api(data, `/position/${params.id}`)
}

const PositionDetail = () => {
  const { id, name, closingDate, description, location, salaryRange, employment } = useLoaderData() as Position

  const tabs = [
    { name: 'Applied', href: `/positions/${id}`, count: '2' },
    { name: 'Phone Screening', href: `/positions/${id}/screened`, count: '4' },
    { name: 'Interview', href: `/positions/${id}/interviewed`, count: '6' },
    { name: 'Offer', href: `/positions/${id}/offered` },
    { name: 'Disqualified', href: `/positions/${id}/disqualified` },
  ]

  return (
    <Content
      title={name}
      // primaryAction={{ label: 'Create', link: '/positions/new' }}
      secondaryAction={{ label: 'Edit', link: `/positions/${id}/edit` }}
    >
      <MetaList className="mt-2">
        <MetaListItem value={salaryRange!} icon={CurrencyDollarIcon}></MetaListItem>
        <MetaListItem value={location!} icon={LocationMarkerIcon}></MetaListItem>
        <MetaListItem value={`Closing on ${dateTimeFormat(closingDate!)}`} icon={CalendarIcon}></MetaListItem>
      </MetaList>

      {description && (
        <div className="mt-8">
          <p>{description}</p>
        </div>
      )}

      <main className="pt-8 pb-16">
        <div className="px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900">Candidates</h2>

          <Tabs tabs={tabs} />
          <Outlet />
        </div>
      </main>
    </Content>
  )
}

export default PositionDetail
