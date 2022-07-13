import { CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/solid'
import type { LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/react/routeModules'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'

import { MetaList, MetaListItem } from '~/components/MetaList'

import type { Position } from '~/models/positions/Position'
import { dateTimeFormat } from '~/utils'

export const meta: MetaFunction = ({ data }) => {
  const { position } = data
  return { title: position.name }
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  await requireAuth(request)

  const stages = await api(data, `/position/${params.id}/pipeline`)
  const position = await api(data, `/position/${params.id}`)
  return jsonWithHeaders({ stages, position })
}

const PositionDetail = () => {
  const { position, stages } = useLoaderData()
  const { id, name, closingDate, description, location, salaryRange, employment } = position as Position

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
          <Outlet context={stages} />
        </div>
      </main>
    </Content>
  )
}

export default PositionDetail
