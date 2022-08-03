import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
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

  await requireAuth(request)

  const userRes = await api(data, `/user/${params.id}`)
  const user = userRes.json()
  // const projects = await projectsRes.clone().json()
  // const position = await api(data, `/position/${params.id}`)
  // TODO make this work properly to load a user's data

  return json({ user, fields: withValues(editUserFormFields(), user) })
}

const EditUser = () => {
  const { user, fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={user.name}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditUser
