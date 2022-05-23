import { BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/solid'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'
import Content from 'app/components/Content'
import Tabs from 'app/components/Tabs'

export const loader: LoaderFunction = async (data) => {
  const { params } = data
  const { id } = params
  return await api(data, `/position/${id}`)
}

const Position = () => {
  const { id, name } = useLoaderData()

  const tabs = [
    { name: 'Applied', href: `/position/${id}/applicants/applied`, count: '2', current: true },
    { name: 'Phone Screening', href: `/position/${id}/applicants/screened`, count: '4', current: false },
    { name: 'Interview', href: `/position/${id}/applicants/interviewed`, count: '6', current: true },
    { name: 'Offer', href: `/position/${id}/applicants/offered`, current: false },
    { name: 'Disqualified', href: `/position/${id}/applicants/disqualified`, current: false },
  ]

  return (
    <Content
      title={name}
      // primaryAction={{ label: 'Create', link: '/positions/new' }}
      secondaryAction={{ label: 'Edit', link: `/positions/${id}/edit` }}
    >
      <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8">
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          Full-time
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <LocationMarkerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          Remote
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CurrencyDollarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          $120k &ndash; $140k
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          Closing on January 9, 2020
        </div>
      </div>

      <main className="pt-8 pb-16">
        <div className="px-4 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900">Candidates</h2>

          <Tabs tabs={tabs} />
        </div>
      </main>
    </Content>
  )
}

export default Position
