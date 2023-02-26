import { UsersIcon, MailIcon, CheckCircleIcon } from '@heroicons/react/solid'

import type { LinkedApplicantProfile } from '~/models/applicant-profiles/ApplicantProfile'

import Empty from './Empty'
import ScoreAssessment from './ScoreAssessment'
import { StackedList, StackedListItem } from './StackedList'

type Props = {
  applicants: LinkedApplicantProfile[]
  emptyText?: string
}

const ApplicantList: React.FC<Props> = ({ applicants = [], emptyText = 'There are no applicants at this stage' }) => {
  return (
    <>
      <StackedList items={applicants} fallback={() => <Empty icon={UsersIcon} title={emptyText} />}>
        {applicants.map((applicant: LinkedApplicantProfile) => (
          <StackedListItem key={applicant.id} link={applicant.link}>
            <div className="flex min-w-0 flex-1 items-center">
              <div className="flex-shrink-0">
                {/* <img className="h-12 w-12 rounded-full" src={application.applicant.imageUrl} alt="" /> */}
              </div>
              <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                {applicant.user && (
                  <div>
                    <p className="text-primary-600 truncate font-medium">{applicant.user.name}</p>
                    <p className="mt-2 flex items-center text-sm text-gray-500">
                      <MailIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="truncate">{applicant.user.email}</span>
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-400">Latest assessment</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <ScoreAssessment
                      value={applicant.interviews[0].averageScore}
                      size={'m'}
                      showLabel={false}
                      interactive={false}
                      {...applicant.interviews[0].scoringSystem}
                    />
                  </div>
                </div>
              </div>
            </div>
          </StackedListItem>
        ))}
      </StackedList>
    </>
  )
}

export default ApplicantList
