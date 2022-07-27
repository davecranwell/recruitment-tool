import { FolderIcon } from '@heroicons/react/outline'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'

import { api } from 'app/api.server'
import type { SessionData } from '~/sessions.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import type { Project } from 'app/models/projects/Project'

export const meta: MetaFunction = ({ data }) => {
  return { title: `Projects at ${data?.sessionData?.activeOrganisation?.name}` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  await requireAuth(request)
  const sessionData = await getSessionData(request)

  return await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)
}

const Projects = () => {
  const sessionData = useOutletContext<SessionData>()
  const projects = useLoaderData()

  const { can, subject } = useAppAbility()

  const canCreateProject = can('manage', subject('Organisation', sessionData?.activeOrganisation))

  return (
    <Content
      title={'Projects'}
      primaryAction={
        projects.data.length &&
        canCreateProject && {
          label: 'Create',
          link: '/projects/new',
        }
      }
    >
      <StackedList
        items={projects.data}
        fallback={() => (
          <Empty
            icon={FolderIcon}
            title={'No projects have been created'}
            createLink={canCreateProject ? '/projects/new' : null}
          />
        )}
      >
        {projects.data.map((position: Project) => (
          <StackedListItem key={position.id} link={`/projects/${position.id}`}>
            <div className="flex items-center justify-between">
              <p className="text-primary-600 truncate text-sm font-medium">{position.name}</p>
              <div className="ml-2 flex flex-shrink-0">
                {/* <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        {position.type}
                      </p> */}
              </div>
            </div>
          </StackedListItem>
        ))}
      </StackedList>

      <Outlet />
    </Content>
  )
}
export default Projects
