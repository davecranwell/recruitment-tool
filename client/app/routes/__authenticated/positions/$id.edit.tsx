import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import formFields from 'app/models/positions/form'

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
  const position = await api(data, `/position/${params.id}`)

  return jsonWithHeaders({ position, fields: withValues(formFields(session), position) })
}

const EditPosition = () => {
  const { position, fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={position.name}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditPosition
