import { useState } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import type { Option } from 'app/components/Forms'
import Form, { withValues } from 'app/components/Forms'
import { notify, requireAuth } from 'app/sessions.server'

import formFields from 'app/models/projects/form'

import Alert from '~/components/Alert'
import Button from '~/components/Button'
import Section from '~/components/Section'
import type { User } from '~/models/users/User'

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
      10_000
    )

    return redirect(`/projects`, { headers })
  }

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)

  const projectRes = await api(data, `/project/${params.id}`)
  const usersRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/users`)
  const pipelinesRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/pipelines`)

  const project = await projectRes.json()
  const users = await usersRes.json()
  const pipelines = await pipelinesRes.json()

  return json({
    project,
    users,
    sessionData,
    pipelines,
  })
}

const EditProject = () => {
  const { project, users, sessionData, pipelines } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()
  const [chosenManagers, chooseManagers] = useState([])
  const [chosenInterviewers, chooseInterviewers] = useState([])
  const [chosenFinancialManagers, chooseFinancialManagers] = useState([])

  const mapRole = (userRole) => ({
    key: userRole.user.name,
    value: userRole.userId,
    avatarUrl: userRole.user.avatarUrl,
  })

  const currentHiringManagers = project.userRoles.filter((userRole) => userRole.role === 'HIRING_MANAGER').map(mapRole)
  const currentInterviewers = project.userRoles.filter((userRole) => userRole.role === 'INTERVIEWER').map(mapRole)
  const currentFinancialManagers = project.userRoles
    .filter((userRole) => userRole.role === 'FINANCIAL_MANAGER')
    .map(mapRole)

  const allUsers = users.data
    // remove the current user
    .filter(({ user }: { user: User }) => user.id !== sessionData.user.id)
    .map(({ user }: { user: User }) => ({
      key: user.name,
      value: user.id,
      avatarUrl: user.avatarUrl,
    }))

  const managerUsers = allUsers.filter(
    (user: Option) =>
      !chosenInterviewers.find((item: Option) => item.value === user.value) &&
      !chosenFinancialManagers.find((item: Option) => item.value === user.value)
  )
  const interviewerUsers = allUsers.filter(
    (user: Option) =>
      !chosenManagers.find((item: Option) => item.value === user.value) &&
      !chosenFinancialManagers.find((item: Option) => item.value === user.value)
  )
  const financialUsers = allUsers.filter(
    (user: Option) =>
      !chosenManagers.find((item: Option) => item.value === user.value) &&
      !chosenInterviewers.find((item: Option) => item.value === user.value)
  )

  const fields = withValues(
    formFields(
      sessionData,
      chooseManagers,
      chooseInterviewers,
      chooseFinancialManagers,
      managerUsers,
      interviewerUsers,
      financialUsers,
      pipelines.data
    ),
    {
      ...project,
      hiringManagers: currentHiringManagers,
      interviewers: currentInterviewers,
      financialManagers: currentFinancialManagers,
    }
  )

  return (
    <Content title={project.name}>
      {currentHiringManagers.length < 1 && (
        <Alert
          className="mb-4"
          type="warning"
          message={
            'There are no hiring managers configured for this project. Only organisation owners will be able to change applicant stages'
          }
        />
      )}

      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />

      <Section title="Danger zone" className="mt-8">
        <Button color="danger" text="Delete project" />
      </Section>
    </Content>
  )
}
export default EditProject
