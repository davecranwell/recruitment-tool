import { CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon, LockClosedIcon } from '@heroicons/react/solid'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/react/routeModules'

import { api } from 'app/api.server'
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
  return json({ stages: await stages.json(), position: await position.json() })
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
        <MetaListItem
          icon={CurrencyDollarIcon}
          title="This is privileged information only available to certain roles in your organisation. Take care if taking screenshots of this page"
        >
          {salaryRange && (
            <>
              {salaryRange!} <LockClosedIcon className="h-4 w-4 flex-shrink-0 text-yellow-600" />
            </>
          )}
        </MetaListItem>
        <MetaListItem icon={LocationMarkerIcon}>{location!}</MetaListItem>
        {closingDate && <MetaListItem icon={CalendarIcon}>{`Closing on ${dateTimeFormat(closingDate!)}`}</MetaListItem>}
      </MetaList>

      {description && (
        <div className="mt-8">
          <p>{description}</p>
        </div>
      )}

      <main className="pt-8 pb-16">
        <Outlet context={stages} />
      </main>
    </Content>
  )
}

export default PositionDetail
