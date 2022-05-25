import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import { withValues } from 'app/components/Forms'
import FormLayout from 'app/components/Forms'
import { requireAuth } from 'app/sessions.server'

import formFields from 'app/models/positions/form'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const body = await request.formData()

  console.log(JSON.stringify(body))

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

  return json({ position, fields: withValues(formFields(session), position) })
}

const EditPosition = () => {
  const { position, fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={position.name}>
      <FormLayout submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditPosition
