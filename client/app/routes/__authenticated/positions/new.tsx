import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form from 'app/components/Forms'

import formFields from 'app/models/positions/form'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const result = await api(data, '/position', 'POST', body)

  if (result.ok) return redirect('/positions')

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const sessionData = await requireAuth(request)

  const projectsRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)
  const projects = await projectsRes.clone().json()

  return jsonWithHeaders({ fields: formFields(sessionData, projects.data), projects: projectsRes })
}

const NewPosition = () => {
  const { fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={'Create a position'}>
      <Form
        submitText="Create this position"
        intro="Lets create you a lovely new position"
        fields={fields}
        errors={errors}
        transition={transition}
      />
    </Content>
  )
}
export default NewPosition
