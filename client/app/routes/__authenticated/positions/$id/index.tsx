import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { UsersIcon } from '@heroicons/react/outline'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import { StackedList, StackedListItem } from 'app/components/StackedList'
import type { ApplicantProfile } from '../../applicant-profiles'
import { MailIcon } from '@heroicons/react/solid'
import invariant from 'tiny-invariant'
import Empty from '~/components/Empty'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants`)
}

type PositionApplicant = ApplicantProfile & {
  user: {
    name: string
    email: string
    id: number
  }
}

const PositionApplicants = () => {
  const applicants = useLoaderData()

  return (
    <div className="py-6">
      {applicants.data.length < 1 && <Empty Icon={UsersIcon} title="There are no applicants for this position" />}
      {applicants.data.length > 0 && (
        <StackedList>
          {applicants.data.map((applicant: PositionApplicant) => (
            <StackedListItem key={applicant.id} link={`/applicant-profiles/${applicant.id}`}>
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex-shrink-0">
                  {/* <img className="h-12 w-12 rounded-full" src={application.applicant.imageUrl} alt="" /> */}
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="truncate text-sm font-medium text-indigo-600">{applicant.user.name}</p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      <MailIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="truncate">{applicant.user.email}</span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div>
                      <p className="text-sm text-gray-900">
                        {/* Applied on <time dateTime={application.date}>{application.dateFull}</time> */}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        {/* <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                        {application.stage} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </StackedListItem>
          ))}
        </StackedList>
      )}
    </div>
  )
}

export default PositionApplicants
