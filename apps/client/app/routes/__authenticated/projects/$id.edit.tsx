import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import { withValues } from 'app/components/Forms'
import Form from 'app/components/Forms'
import { requireAuth } from 'app/sessions.server'

import formFields from 'app/models/projects/form'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const body = await request.formData()

  const result = await api(data, `/project/${params.id}`, 'PATCH', body)
  if (result.ok) return redirect(`/project/${params.id}`)

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data

  const { sessionData } = await requireAuth(request)
  const projectRes = await api(data, `/project/${params.id}`)

  const project = await projectRes.json()

  return json({ project, fields: withValues(formFields(sessionData), project) })
}

const EditProject = () => {
  const { project, fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={project.name}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />
    </Content>
  )
}
export default EditProject
