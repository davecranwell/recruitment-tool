import { BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { FolderIcon, LockClosedIcon, PlusIcon } from '@heroicons/react/solid'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useNavigate, useParams } from '@remix-run/react'

import { api } from 'app/api.server'
import { requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { MetaList, MetaListItem } from 'app/components/MetaList'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import { dateTimeFormat } from 'app/utils'
import Chooser from '~/components/Chooser'
import type { Position } from '~/models/positions/Position'
import type { Project } from '~/models/projects/Project'

export const handle = {
  hideBannerAction: true,
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)

  const positions = await api(
    data,
    `/organisation/${sessionData.activeOrganisation.id}/project/${params.projectId}/positions`
  )
  const projects = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)

  // sessionData returned so meta() function can use it
  return json({ sessionData, positions: await positions.json(), projects: await projects.json() })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Positions at ${data?.sessionData?.activeOrganisation?.name}` }
}

const Positions = () => {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { positions, projects, sessionData } = useLoaderData()
  const { can, subject } = useAppAbility()

  const canCreatePosition = can(
    'create',
    subject('Position', { projectId, organisationId: sessionData.activeOrganisation.id })
  )

  const projectItems = projects.data.map((project: Project) => ({
    key: project.name,
    value: project.id,
    count: project?._count?.positions,
  }))

  return (
    <Content titleSize="larger">
      <div className="border-b border-gray-200 pb-5 mb-12 sm:flex sm:items-center sm:justify-between">
        {!projects.data.length ? (
          <Empty
            icon={FolderIcon}
            title={'There are no Projects in this Organisation to which you have access'}
            intro={
              'Projects are create by Organisation Owners who grant user access to projects individually. If you feel you are missing access to a project, you may need to talk to your Organisation Owner to correct this'
            }
          />
        ) : (
          <>
            <Chooser
              className={'max-w-md w-full lg:w-1/3 justify-items-stretch'}
              label={'Project'}
              value={projectItems.find((project: any) => project.value === parseInt(projectId!, 10))}
              onChange={(value: any) => navigate(`/positions/project/${value.value}`)}
              items={projectItems}
            />
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              {canCreatePosition && (
                <Link
                  to={`/positions/new?projectId=${projectId}`}
                  className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Create new position
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <StackedList
        className="mt-4"
        items={positions.data}
        fallback={() => <Empty icon={BriefcaseIcon} title={'No positions have been created in this project'} />}
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
              <MetaListItem
                icon={CurrencyDollarIcon}
                title="This is privileged information only available to certain roles in your organisation. Take care if taking screenshots of this page"
              >
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
    </Content>
  )
}

export default Positions
