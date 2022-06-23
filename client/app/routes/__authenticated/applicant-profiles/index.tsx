import { CalendarIcon, CurrencyPoundIcon, UsersIcon } from '@heroicons/react/outline'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'
import { getSessionData, requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { dateTimeFormat } from 'app/utils'

export const meta: MetaFunction = ({ data }) => {
  return { title: `Applicants to ${data?.sessionData?.activeOrganisation?.name}` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const user = await requireAuth(request)
  const sessionData = await getSessionData(request)

  const profiles = await api(data, `/applicant-profile/by-user/${user.user.id}`)

  return json({ sessionData, profiles: await profiles.json() })
}

export type ApplicantProfile = {
  id: number
  askingSalary: string
  profileName: string
  updatedAt: Date
  user?: {
    email: string
    name: string
  }
}

const ApplicantProfiles = () => {
  const { profiles } = useLoaderData()

  return (
    <Content
      title={'Applicant Profiles'}
      primaryAction={profiles.data.length && { label: 'Create', link: '/profile/new' }}
    >
      {profiles.data.length < 1 && <Empty Icon={UsersIcon} title={'There are no applicants in this organisation'} />}
      {profiles.data.length > 0 && (
        <StackedList>
          {profiles.data.map((profile: ApplicantProfile) => (
            <StackedListItem key={profile.id} link={`/applicant-profiles/${profile.id}`}>
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-indigo-600">{profile.profileName}</p>
                <div
                  className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
                  title={profile.updatedAt.toString()}
                >
                  <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <p>
                    Last updated{' '}
                    <time dateTime={profile.updatedAt.toString()}>{dateTimeFormat(profile.updatedAt)}</time>
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <CurrencyPoundIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    {profile.askingSalary}
                  </p>
                  {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <LocationMarkerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {position.location}
                      </p> */}
                </div>
              </div>
            </StackedListItem>
          ))}
        </StackedList>
      )}
    </Content>
  )
}
export default ApplicantProfiles
