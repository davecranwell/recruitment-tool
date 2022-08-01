import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api, jsonWithHeaders, redirectWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import formFields from 'app/models/positions/form'

export const action: ActionFunction = async (data) => {
  const { request, params } = data

  const result = await api(data, `/position/${params.id}`, 'PATCH', await request.formData())
  if (result.ok) return redirectWithHeaders(result, `/positions/${params.id}`)

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  // return invariant(params.id, 'Expected position ID')

  const session = await requireAuth(request)
  const projectRes = await api(data, `/organisation/${session.activeOrganisation.id}/projects`)
  const positionRes = await api(data, `/position/${params.id}`)

  // console.log(await projects.clone().json())
  // console.log(await position.clone().json())
  const projects = await projectRes.json()
  const position = await positionRes.json()

  return jsonWithHeaders({ position, fields: withValues(formFields(session, projects.data), position) })
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
