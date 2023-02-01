import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import formFields from 'app/models/positions/form'

export const handle = {
  hideBannerAction: true,
}

export const action: ActionFunction = async (data) => {
  const { request, params } = data

  const result = await api(data, `/position/${params.id}`, 'PATCH', await request.formData())
  if (result.ok) return redirect(`/positions/${params.id}`)

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  // return invariant(params.id, 'Expected position ID')

  const { sessionData } = await requireAuth(request)
  const projectRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)
  const positionRes = await api(data, `/position/${params.id}`)

  const projects = await projectRes.json()
  const position = await positionRes.json()

  return json({ position, fields: withValues(formFields(sessionData, projects.data), position) })
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
