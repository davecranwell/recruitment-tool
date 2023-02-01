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
            <div className="flex items-center justify-between text-sm font-medium">
              <p className="text-primary-600 truncate ">{project.name}</p>
            </div>
          </StackedListItem>
        ))}
      </StackedList>

      <Outlet />
    </Content>
  )
}
export default Projects
