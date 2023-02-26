import {
  BriefcaseIcon,
  CheckCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  LocationMarkerIcon,
} from '@heroicons/react/outline'
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
import Button from '~/components/Button'
import Pill from '~/components/Pill'

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
              onChange={({ value }: { value: number }) => navigate(`/positions/project/${value}`)}
              items={projectItems}
            />
            <div className="mt-3 flex sm:mt-0 sm:ml-4">
              {canCreatePosition && (
                <Button
                  component={Link}
                  color="primary"
                  to={`/positions/new?projectId=${projectId}`}
                  text="Create new position"
                  icon={PlusIcon}
                />
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
              <p className="text-primary-600 truncate font-medium">{position.name}</p>

              <div className="ml-2 flex flex-shrink-0">
                <Pill status="bad">Approved</Pill>

                {/* <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                  {position.type}
                </p> */}
              </div>
            </div>
            <MetaList className="mt-2 text-sm">
              <MetaListItem
                icon={CurrencyDollarIcon}
                title="This information is only visible to organisation owners or hiring managers"
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
              <MetaListItem icon={CheckCircleIcon}></MetaListItem>
            </MetaList>
          </StackedListItem>
        ))}
      </StackedList>
    </Content>
  )
}

export default Positions
