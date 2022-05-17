import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { LocationMarkerIcon, UsersIcon } from '@heroicons/react/solid'
import { CurrencyPoundIcon, CalendarIcon } from '@heroicons/react/outline'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/content'

export async function loader({ request }: { request: Request }) {
  const auth = await requireAuth(request)

  return await api(request, `/user/${auth.user.id}/organisations`)
}

export type Organisation = {
  id: number
  name: string
  machineName: string
}

const ChooseOrganisation = () => {
  const organisations = useLoaderData()

  return (
    <Content title={'Choose an organisation to continue'}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {organisations.map((organisation: Organisation) => (
          <div
            key={organisation.id}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              {/* <img className="h-10 w-10 rounded-full" src={organisation.imageUrl} alt="" /> */}
            </div>
            <div className="min-w-0 flex-1">
              <Link to={`/choose-organisation/${organisation.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-xl font-medium text-gray-900">{organisation.name}</p>
                <p className="truncate text-sm text-gray-500">{organisation.machineName}</p>
              </Link>
            </div>
          </div>

          // <li
          //   key={organisation.id}
          //   className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
          // >
          //   <Link to={`/applicant-profiles/${profile.id}`} className="block hover:bg-gray-50">
          //     <div className="px-4 py-4 sm:px-6">
          //       <div className="flex items-center justify-between">
          //         <p className="truncate text-sm font-medium text-indigo-600">{profile.profileName}</p>
          //         <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0" title={profile.updatedAt}>
          //           <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          //           <p>
          //             Last updated{' '}
          //             <time dateTime={profile.updatedAt}>
          //               {new Intl.DateTimeFormat('en-GB', {
          //                 year: 'numeric',
          //                 month: 'long',
          //                 day: '2-digit',
          //               }).format(new Date(profile.updatedAt))}
          //             </time>
          //           </p>
          //         </div>
          //       </div>
          //       <div className="mt-2 sm:flex sm:justify-between">
          //         <div className="sm:flex">
          //           <p className="flex items-center text-sm text-gray-500">
          //             <CurrencyPoundIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          //             {profile.askingSalary}
          //           </p>
          //           {/* <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
          //               <LocationMarkerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          //               {position.location}
          //             </p> */}
          //         </div>
          //       </div>
          //     </div>
          //   </Link>
          // </li>
        ))}
      </div>
    </Content>
  )
}
export default ChooseOrganisation
