import { BriefcaseIcon, CalendarIcon, CurrencyDollarIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import { LockClosedIcon } from '@heroicons/react/solid'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Outlet, RouteMatch, useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { MetaList, MetaListItem } from 'app/components/MetaList'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import { dateTimeFormat } from 'app/utils'
import { Position } from '~/models/positions/Position'
import Button from '~/components/Button'
import { ForcedSubject } from '@casl/ability'
import { Project } from '~/models/projects/Project'

export const handle = {
  hideBannerAction: true,
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Positions at ${data?.sessionData?.activeOrganisation?.name}` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  const positions = await api(data, `/organisation/${sessionData.activeOrganisation.id}/positions`)

  // sessionData returned so meta() function can use it
  return json({ sessionData, positions: await positions.json() })
}

function getVal(object: any, path: string) {
  return path.split('.').reduce((res, prop) => res[prop], object)
}

export const bucketMap = (items: any[], bucket: string, destination: string = 'items'): Array<any> => {
  const buckets = {} as any

  if (!items?.length) return []

  items.forEach((item) => {
    const bucketName = getVal(item, bucket) || 0

    !buckets[bucketName] && (buckets[bucketName] = { [destination]: [] })
    buckets[bucketName].items.push(item)
  })

  return Object.values(buckets)
}

type MappedBucket<T> = {
  items: T[]
  canCreatePositions?: boolean
}

const Positions = () => {
  const { positions, sessionData } = useLoaderData()
  const { can, subject, possibleRulesFor } = useAppAbility()

  // bucketMap them by the project of each
  const positionsByProject = bucketMap(positions.data, 'project.name')

  // update each project group with its create permissions
  // TODO this is horrid
  positionsByProject.forEach((project: MappedBucket<Position>) => {
    project.items.forEach((position: Position) => {
      const positionObj = {
        projectId: project.items[0]?.project?.id,
        project: { organisationId: sessionData?.activeOrganisation.id },
      } as Partial<Position>

      project.canCreatePositions = can('create', subject('Position', positionObj))
    })
  })

  return (
    <Content titleSize="larger">
      <div className="space-y-6">
        {positionsByProject.map((project: MappedBucket<Position>, index: number) => (
          <div key={`project${index}`}>
            <div className="sm:flex sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium leading-6 text-gray-900">{project.items[0]?.project?.name}</h2>
              {project.canCreatePositions && <Button component={Link} to={'/positions/new'} text={'Create'} />}
            </div>
            <StackedList
              className="mt-4"
              items={positions.data}
              fallback={() => (
                <Empty
                  icon={BriefcaseIcon}
                  title={'No positions have been created'}
                  createLink={can('create', 'Position') ? '/positions/new' : null}
                />
              )}
            >
              {project.items.map((position: Position) => (
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
                    <MetaListItem icon={CalendarIcon}>{`Closing on ${dateTimeFormat(
                      position.closingDate!
                    )}`}</MetaListItem>
                  </MetaList>
                </StackedListItem>
              ))}
            </StackedList>
          </div>
        ))}
      </div>
    </Content>
  )
}
export default Positions
