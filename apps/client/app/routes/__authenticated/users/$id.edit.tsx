import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { notify, requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import { editUserFormFields } from 'app/models/users/form'

export const action: ActionFunction = async (data) => {
  const { request, params } = data

  const { sessionData, session } = await requireAuth(request)

  const body = await request.formData()

  const result = await api(data, `/organisation/${sessionData.activeOrganisation.id}/user/${params.id}`, 'PATCH', body)
  const headers = result.ok
    ? await notify(session).success('User updated')
    : await notify(session).error('An error occured')

  if (result.ok) return redirect(`/users`, { headers })

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data

  const { sessionData } = await requireAuth(request)

  const userRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/user/${params.id}`)
  const user = await userRes.json()

  const fields = withValues(editUserFormFields(), { ...user, ...user.user })

  return json({ user, fields })
}

const EditUser = () => {
  const { user, fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={user.user.name}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditUser
