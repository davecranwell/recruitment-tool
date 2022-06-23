import { CalendarIcon, FolderAddIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { MetaList, MetaListItem } from 'app/components/MetaList'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { dateTimeFormat } from 'app/utils'
import { useAppAbility } from 'app/hooks/useAppAbility'

export const meta: MetaFunction = ({ data }) => {
  return { title: `Positions at ${data?.sessionData?.activeOrganisation?.name}` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  await requireAuth(request)
  const sessionData = await getSessionData(request)

  const positions = await api(data, `/organisation/${sessionData.activeOrganisation.id}/positions`)

  return json({ sessionData, positions: await positions.json() })
}

export enum PositionEmploymentType {
  FULL,
  PART,
  CONTRACT,
}

export type Position = {
  id: number
  name: string
  salary?: string
  description?: String
  openingDate?: Date
  closingDate?: Date
  employment?: PositionEmploymentType
  location?: string
  salaryRange?: string
}

const Positions = () => {
  const { positions } = useLoaderData()
  const { can } = useAppAbility()

  return (
    <Content
      title={'Positions'}
      primaryAction={positions.data.length && can('create', 'Position') && { label: 'Create', link: '/positions/new' }}
    >
      {positions.data.length < 1 && (
        <Empty
          Icon={FolderAddIcon}
          title={'No positions have been created'}
          createLink={can('create', 'Position') ? '/positions/new' : null}
        />
      )}
      {positions.data.length > 0 && (
        <StackedList>
          {positions.data.map((position: Position) => (
            <StackedListItem key={position.id} link={`/positions/${position.id}`}>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-indigo-600">{position.name}</p>
                <div className="ml-2 flex flex-shrink-0">
                  {/* <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {position.type}
                      </p> */}
                </div>
              </div>
              <MetaList className="mt-2">
                <MetaListItem value={position.salaryRange!} icon={CurrencyDollarIcon}></MetaListItem>
                <MetaListItem value={position.location!} icon={LocationMarkerIcon}></MetaListItem>
                <MetaListItem
                  value={`Closing on ${dateTimeFormat(position.closingDate!)}`}
                  icon={CalendarIcon}
                ></MetaListItem>
              </MetaList>
            </StackedListItem>
          ))}
        </StackedList>
      )}
      <Outlet />
    </Content>
  )
}
export default Positions
