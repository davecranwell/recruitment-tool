import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useMatches, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import { Option, withValues } from 'app/components/Forms'
import Form from 'app/components/Forms'
import { notify, requireAuth } from 'app/sessions.server'

import formFields from 'app/models/projects/form'
import Breadcrumb from '~/components/Breadcrumb'
import { User } from '~/models/users/User'
import { useState } from 'react'

export const handle = {
  hideBannerAction: true,
}

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const { session } = await requireAuth(request)

  const body = await request.formData()
  const result = await api(data, `/project/${params.id}`, 'PATCH', body)

  if (result.ok) {
    const headers = await notify(session).success(
      {
        title: 'Project updated',
        description:
          'Users affected by changes to project roles may need to log out and in again for changes to take effect',
      },
      0
    )

    return redirect(`/projects`, { headers })
  }
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)

  const projectRes = await api(data, `/project/${params.id}`)
  const usersRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/users`)

  const project = await projectRes.json()
  const users = await usersRes.json()

  return json({
    project,
    users,
    sessionData,
  })
}

const EditProject = () => {
  const { project, users, sessionData } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()
  const [chosenManagers, chooseManagers] = useState([])
  const [chosenInterviewrs, chooseInterviews] = useState([])

  const currentHiringManagers = project.userRoles
    .filter((userRole) => userRole.role === 'HIRING_MANAGER')
    .map((userRole) => ({ key: userRole.user.name, value: userRole.userId, avatarUrl: userRole.user.avatarUrl }))

  const currentInterviewers = project.userRoles
    .filter((userRole) => userRole.role === 'INTERVIEWER')
    .map((userRole) => ({ key: userRole.user.name, value: userRole.userId, avatarUrl: userRole.user.avatarUrl }))

  const allUsers = users.data
    // remove the current user
    .filter(({ user }: { user: User }) => user.id !== sessionData.user.id)
    .map(({ user }: { user: User }) => ({
      key: user.name,
      value: user.id,
      avatarUrl: user.avatarUrl,
    }))

  const managerUsers = allUsers.filter(
    (user: Option) => !chosenInterviewrs.find((item: Option) => item.value === user.value)
  )
  const interviewerUsers = allUsers.filter(
    (user: Option) => !chosenManagers.find((item: Option) => item.value === user.value)
  )

  const fields = withValues(formFields(sessionData, chooseManagers, chooseInterviews, managerUsers, interviewerUsers), {
    ...project,
    hiringManagers: currentHiringManagers,
    interviewers: currentInterviewers,
  })

  return (
    <Content title={project.name}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditProject
