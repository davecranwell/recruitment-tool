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
        title={'There are no projects in this organisation to which you have access'}
        intro={
          'Projects are create by organisation owners who grant users access individually. You may need to talk to your organisation owner if you feel you should have access to more projects'
        }
      />
    </Content>
  )
}

export default PositionsIndex
