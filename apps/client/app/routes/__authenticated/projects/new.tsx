import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Ability, subject } from '@casl/ability'
import { unpackRules } from '@casl/ability/extra'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'
import type { Option } from 'app/components/Forms'
import { notify, requireAuth } from 'app/sessions.server'

import formFields from 'app/models/projects/form'
import { ForbiddenResponse } from '~/utils/errors'
import { User } from '~/models/users/User'
import { useState } from 'react'
import Alert from '~/components/Alert'

export const handle = {
  hideBannerAction: true,
}

export const action: ActionFunction = async (data) => {
  const { request } = data
  const { session } = await requireAuth(request)

  const body = await request.formData()

  const result = await api(data, '/project', 'POST', body)

  if (result.ok) {
    const headers = await notify(session).success('Project created')
    return redirect('/projects', { headers })
  }

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  const ability = new Ability()
  ability.update(unpackRules(sessionData.user.abilities))
  if (!ability.can('create', subject('Project', { organisationId: sessionData.activeOrganisation.id }))) {
    throw ForbiddenResponse()
  }

  const usersRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/users`)
  const users = await usersRes.json()

  return json({ sessionData, users })
}

const NewProject = () => {
  const { sessionData, users } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()
  const [chosenManagers, chooseManagers] = useState([])
  const [chosenInterviewrs, chooseInterviews] = useState([])

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
    hiringManagers: [],
    interviewers: [],
  })

  return (
    <Content
      title="Create a project"
      intro="Projects allow you to group your positions by department, hiring round, or any other business need. A hiring
    team is assigned to each project and only those assigned can work on positions within it."
    >
      <Form
        submitText="Create this project"
        intro={
          <>
            <Alert
              type="info"
              message={
                'You can create a project without assigning any roles, but until you do, only organisation owners will be able to access positions you add to this project'
              }
            />
          </>
        }
        fields={fields}
        errors={errors}
        transition={transition}
      />
    </Content>
  )
}
export default NewProject
