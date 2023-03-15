import { ChevronDoubleRightIcon } from '@heroicons/react/outline'
import { json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, Outlet, RouteMatch, useLoaderData, useOutletContext } from '@remix-run/react'

import { api } from 'app/api.server'
import type { SessionData } from '~/sessions.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import type { Pipeline } from 'app/models/pipeline/Pipeline'
import Counter from '~/components/Counter'

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  await requireAuth(request)
  const sessionData = await getSessionData(request)

  const pipelines = await api(data, `/organisation/${sessionData.activeOrganisation.id}/pipelines`)

  return json({ pipelines: await pipelines.json(), sessionData })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Pipelines at ${data?.sessionData?.activeOrganisation?.name}` }
}

const Pipelines = () => {
  const sessionData = useOutletContext<SessionData>()
  const { pipelines } = useLoaderData()

  const { can, subject } = useAppAbility()

  const canCreatePipelines = can('manage', subject('Organisation', sessionData?.activeOrganisation))

  return (
    <Content>
      <StackedList
        items={pipelines.data}
        fallback={() => (
          <Empty
            icon={ChevronDoubleRightIcon}
            title={'No pipelines have been created'}
            createLink={canCreatePipelines ? '/pipelines/new' : null}
          />
        )}
      >
        {pipelines.data.map((pipeline: Pipeline) => (
          <StackedListItem key={pipeline.id} link={`/pipelines/${pipeline.id}/edit`}>
            <div className="flex items-center justify-between font-medium">
              <p className="text-primary truncate ">
                {pipeline.name}{' '}
                {pipeline?._count?.positions && pipeline?._count?.positions > 0 ? (
                  <Counter>{pipeline?._count?.positions}</Counter>
                ) : null}
              </p>
              <p className="text-gray-500 text-sm truncate">{pipeline.description}</p>
            </div>
          </StackedListItem>
        ))}
      </StackedList>

      <Outlet />
    </Content>
  )
}
export default Pipelines
