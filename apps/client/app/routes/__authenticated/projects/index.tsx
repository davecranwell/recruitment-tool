import { FolderIcon } from '@heroicons/react/outline'
import { json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, Outlet, RouteMatch, useLoaderData, useOutletContext } from '@remix-run/react'

import { api } from 'app/api.server'
import type { SessionData } from '~/sessions.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import type { Project } from 'app/models/projects/Project'

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  await requireAuth(request)
  const sessionData = await getSessionData(request)

  const projects = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)

  return json({ projects: await projects.json(), sessionData })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Projects at ${data?.sessionData?.activeOrganisation?.name}` }
}

const Projects = () => {
  const sessionData = useOutletContext<SessionData>()
  const { projects } = useLoaderData()

  const { can, subject } = useAppAbility()

  const canCreateProject = can('manage', subject('Organisation', sessionData?.activeOrganisation))

  return (
    <Content>
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
        {projects.data.map((project: Project) => (
          <StackedListItem key={project.id} link={`/projects/${project.id}/edit`}>
            <div className="flex items-center justify-between font-medium">
              <p className="text-primary-600 truncate ">
                {project.name}{' '}
                {project?._count?.positions && project?._count?.positions > 0 ? (
                  <span className={'ml-auto inline-block py-0.5 px-3 text-xs rounded-full text-gray-500 bg-gray-50'}>
                    {project?._count?.positions}
                  </span>
                ) : null}
              </p>
              <p className="text-gray-500 text-sm truncate">{project.description}</p>
            </div>
          </StackedListItem>
        ))}
      </StackedList>

      <Outlet />
    </Content>
  )
}
export default Projects
