import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'

import { getSessionData } from '~/sessions.server'

import Content from 'app/components/Content'
import { CalendarIcon, CurrencyPoundIcon } from '@heroicons/react/outline'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'
import { dateTimeFormat } from 'app/utils'

export async function loader({ request }: { request: Request }) {
  const sessionData = await getSessionData(request)

  return await api(request, `/organisation/${sessionData.activeOrganisation.id}/positions`)
}

export type Position = {
  id: number
  name: string
  salary?: string
  description?: String
  openingDate?: Date
  closingDate?: Date
}

const Positions = () => {
  const positions = useLoaderData()

  return (
    <Content title={'Positions'} primaryAction={positions.data.length && { label: 'Create', link: '/positions/new' }}>
      {positions.data.length < 1 && <Empty name={'position'} />}
      {positions.data.length > 0 && (
        <StackedList>
          {positions.data.map((position: Position) => (
            <StackedListItem key={position.id} link={'#'}>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-indigo-600">{position.name}</p>
                <div className="ml-2 flex flex-shrink-0">
                  {/* <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {position.type}
                      </p> */}
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  {position.salary && (
                    <p className="flex items-center text-sm text-gray-500">
                      <CurrencyPoundIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      {position.salary}
                    </p>
                  )}
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    {/* <LocationMarkerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {position.location} */}
                  </p>
                </div>
                {position.closingDate && (
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <p>
                      Closing on{' '}
                      <time dateTime={position.closingDate.toString()}>{dateTimeFormat(position.closingDate)}</time>
                    </p>
                  </div>
                )}
              </div>
            </StackedListItem>
          ))}
        </StackedList>
      )}
    </Content>
  )
}
export default Positions
