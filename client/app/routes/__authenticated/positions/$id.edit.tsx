import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api, forwardHeaders } from 'app/api.server'

import Content from 'app/components/Content'
import { withValues } from 'app/components/Forms'
import Form from 'app/components/Forms'
import { requireAuth } from 'app/sessions.server'

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
  const positionRes = await api(data, `/position/${params.id}`)
  const position = await positionRes.json()

  return forwardHeaders({ position, fields: withValues(formFields(session), position) })
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
