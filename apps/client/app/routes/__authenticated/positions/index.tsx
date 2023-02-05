import { FolderIcon } from '@heroicons/react/solid'
import { json, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'
import Content from '~/components/Content'
import Empty from '~/components/Empty'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)

  const projects = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)
  const projectsData = await projects.json()

  if (projectsData.data.length) {
    return redirect(`/positions/project/${projectsData.data[0].id}`)
  } else {
    return null
  }
}

const PositionsIndex = () => {
  return (
    <Content titleSize="larger">
      <Empty
        icon={FolderIcon}
        title={'There are no Projects in this Organisation to which you have access'}
        intro={
          'Projects are create by Organisation Owners who grant user access to projects individually. If you feel you are missing access to a project, you may need to talk to your Organisation Owner to correct this'
        }
      />
    </Content>
  )
}

export default PositionsIndex
