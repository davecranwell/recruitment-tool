import { UsersIcon, MailIcon } from '@heroicons/react/solid'

import type { LinkedApplicantProfile } from '~/models/applicant-profiles/ApplicantProfile'

import Empty from './Empty'
import { StackedList, StackedListItem } from './StackedList'

type Props = {
  applicants: LinkedApplicantProfile[]
  emptyText?: string
}

const ApplicantList: React.FC<Props> = ({ applicants, emptyText = 'There are no applicants at this stage' }) => {
  return (
    <>
      {applicants.length < 1 && <Empty Icon={UsersIcon} title={emptyText} />}
      {applicants.length > 0 && (
        <StackedList>
          {applicants.map((applicant: LinkedApplicantProfile) => (
            <StackedListItem key={applicant.id} link={applicant.link}>
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex-shrink-0">
                  {/* <img className="h-12 w-12 rounded-full" src={application.applicant.imageUrl} alt="" /> */}
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  {applicant.user && (
                    <div>
                      <p className="truncate text-sm font-medium text-indigo-600">{applicant.user.name}</p>
                      <p className="mt-2 flex items-center text-sm text-gray-500">
                        <MailIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        <span className="truncate">{applicant.user.email}</span>
                      </p>
                    </div>
                  )}
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
    </>
  )
}

export default ApplicantList
