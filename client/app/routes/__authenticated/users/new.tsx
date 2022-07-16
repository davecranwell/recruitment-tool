import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import formFields from 'app/models/users/form'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const body = await request.formData()

  const result = await api(data, `/position/${params.id}`, 'PATCH', body)
  if (result.ok) return redirect(`/positions/${params.id}`)

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  // return invariant(params.id, 'Expected position ID')

  const session = await requireAuth(request)
  // const projectsRes = await api(data, `/organisation/${session.activeOrganisation.id}/projects`)
  // const projects = await projectsRes.clone().json()
  // const position = await api(data, `/position/${params.id}`)

  return jsonWithHeaders({ fields: withValues(formFields(session), {}) })
}

const EditUser = () => {
  const { fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={'Invite a user to the organisation'}>
      <Form submitText="Send invitation" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditUser
