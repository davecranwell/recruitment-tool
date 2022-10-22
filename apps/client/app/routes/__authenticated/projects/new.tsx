import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Ability, subject } from '@casl/ability'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import Form from 'app/components/Forms'
import { requireAuth } from 'app/sessions.server'

import formFields from 'app/models/projects/form'
import { ForbiddenResponse } from '~/utils/errors'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const result = await api(data, '/project', 'POST', body)

  if (result.ok) return redirect('/projects')

  return result
}

export const loader: LoaderFunction = async ({ request }) => {
  const { sessionData } = await requireAuth(request)

  const ability = new Ability(sessionData.user.abilities)
  if (!ability.can('manage', subject('Organisation', sessionData.activeOrganisation))) {
    throw ForbiddenResponse()
  }

  return json(formFields(sessionData))
}

const NewProject = () => {
  const fields = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={'Create a project'}>
      <Form
        submitText="Create this project"
        intro="Projects allow you to group your positions by department, hiring round, or any other business need. A hiring team is assigned exclusively to each project, and only those assigned can see positions within it."
        fields={fields}
        errors={errors}
        transition={transition}
      />
    </Content>
  )
}
export default NewProject
