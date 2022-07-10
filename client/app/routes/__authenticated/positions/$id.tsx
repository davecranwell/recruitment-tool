import { CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/solid'
import type { LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/react/routeModules'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Tabs from 'app/components/Tabs'
import { MetaList, MetaListItem } from '~/components/MetaList'

import type { Position } from '~/models/positions/Position'
import { dateTimeFormat } from '~/utils'

export const meta: MetaFunction = ({ data }) => {
  return { title: data.name }
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  await requireAuth(request)
  const position = await api(data, `/position/${params.id}`)
  const stages = await api(data, `/position/${params.id}/pipeline`)

  return jsonWithHeaders({ position, stages })
}

const PositionDetail = () => {
  const { position, stages } = useLoaderData()
  const { id, name, closingDate, description, location, salaryRange, employment } = position as Position

  const totalCount = stages.stages.reduce((acc: number, curr: any) => {
    const { stage } = curr
    return (acc = acc + stage._count.applicants)
  }, 0)

  const tabs = [
    {
      name: 'All',
      href: `/positions/${id}`,
      count: totalCount,
    },
  ]

  tabs.push(
    ...stages.stages.map(({ stage }: { stage: any }) => ({
      name: stage.name,
      href: `/positions/${id}/${stage.id}`,
      count: stage._count.applicants,
    }))
  )

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
