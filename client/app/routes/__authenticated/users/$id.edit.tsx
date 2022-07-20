import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import { editUserFormFields } from 'app/models/users/form'

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
  // TODO make this work properly to load a user's data
  return jsonWithHeaders({ fields: withValues(editUserFormFields(), {}) })
}

const EditUser = () => {
  const { fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={'user name goes here'}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditUser
