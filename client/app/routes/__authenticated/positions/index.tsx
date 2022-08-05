import { BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { LockClosedIcon } from '@heroicons/react/solid'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { MetaList, MetaListItem } from 'app/components/MetaList'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import { dateTimeFormat } from 'app/utils'
import type { Position } from '~/models/positions/Position'

export const meta: MetaFunction = ({ data }) => {
  return { title: `Positions at ${data?.sessionData?.activeOrganisation?.name}` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  const positions = await api(data, `/organisation/${sessionData.activeOrganisation.id}/positions`)

  // sessionData returned so meta() function can use it
  return json({ sessionData, positions: await positions.json() })
}

const Positions = () => {
  const { positions } = useLoaderData()
  const { can } = useAppAbility()

  return (
    <Content
      title={'Positions'}
      primaryAction={positions.data.length && can('create', 'Position') && { label: 'Create', link: '/positions/new' }}
    >
      <StackedList
        items={positions.data}
        fallback={() => (
          <Empty
            icon={BriefcaseIcon}
            title={'No positions have been created'}
            createLink={can('create', 'Position') ? '/positions/new' : null}
          />
        )}
      >
        {positions.data.map((position: Position) => (
          <StackedListItem key={position.id} link={`/positions/${position.id}`}>
            <div className="flex items-center justify-between">
              <p className="text-primary-600 truncate text-sm font-medium">{position.name}</p>
              <div className="ml-2 flex flex-shrink-0">
                {/* <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {position.type}
                      </p> */}
              </div>
            </div>
            <MetaList className="mt-2">
              <MetaListItem icon={CurrencyDollarIcon}>
                {position.salaryRange && (
                  <>
                    {position.salaryRange!}
                    <LockClosedIcon className="h-4 w-4 flex-shrink-0 text-yellow-600" aria-hidden="true" />
                  </>
                )}
              </MetaListItem>
              <MetaListItem icon={LocationMarkerIcon}>{position.location!}</MetaListItem>
              <MetaListItem icon={CalendarIcon}>{`Closing on ${dateTimeFormat(position.closingDate!)}`}</MetaListItem>
            </MetaList>
          </StackedListItem>
        ))}
      </StackedList>

      <Outlet />
    </Content>
  )
}
export default Positions
