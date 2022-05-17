import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { LocationMarkerIcon, UsersIcon } from '@heroicons/react/solid'
import { CurrencyPoundIcon, CalendarIcon } from '@heroicons/react/outline'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/content'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)

  return await api(request, `/applicant-profile/by-user/${user.user.id}`)
}

export type ApplicantProfile = {
  id: number
  askingSalary: string
  profileName: string
  updatedAt: string
}

const ApplicantProfiles = () => {
  const profiles = useLoaderData()

  return (
    <Content title={'Applicant Profiles'}>
      <div className="overflow-hidden border border-gray-200 bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {profiles.data.map((profile: ApplicantProfile) => (
            <li key={profile.id}>
              <Link to={`/applicant-profiles/${profile.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-indigo-600">{profile.profileName}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0" title={profile.updatedAt}>
                      <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <p>
                        Last updated{' '}
                        <time dateTime={profile.updatedAt}>
                          {new Intl.DateTimeFormat('en-GB', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit',
                          }).format(new Date(profile.updatedAt))}
                        </time>
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
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Content>
  )
}
export default ApplicantProfiles
