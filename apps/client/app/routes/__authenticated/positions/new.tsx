import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Link,
  RouteMatch,
  useActionData,
  useLoaderData,
  useParams,
  useSearchParams,
  useTransition,
} from '@remix-run/react'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import formFields from 'app/models/positions/form'

export const handle = {
  hideBannerAction: true,
}

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const result = await api(data, '/position', 'POST', body)

  if (result.ok) return redirect('/positions')

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  const projectsRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)
  const projects = await projectsRes.json()

  return json({ fields: formFields(sessionData, projects.data) })
}

const NewPosition = () => {
  const { fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  const preselectedProject = searchParams.get('projectId')

  return (
    <Content title={'Create a position'}>
      <Form
        submitText="Create this position"
        fields={withValues(fields, { projectId: preselectedProject })}
        errors={errors}
        transition={transition}
      />
    </Content>
  )
}
export default NewPosition
