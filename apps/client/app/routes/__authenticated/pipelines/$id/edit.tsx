import { useState } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import type { Option } from 'app/components/Forms'
import Form, { withValues } from 'app/components/Forms'
import { notify, requireAuth } from 'app/sessions.server'

import formFields from 'app/models/pipeline/form'

import Alert from '~/components/Alert'
import Button from '~/components/Button'
import Section from '~/components/Section'
import type { User } from '~/models/users/User'

export const handle = {
  hideBannerAction: true,
}

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const { session } = await requireAuth(request)

  const body = await request.formData()
  const result = await api(data, `/pipeline/${params.id}`, 'PATCH', body)

  if (result.ok) {
    const headers = await notify(session).success(
      {
        title: 'Pipeline updated',
        description:
          'Users affected by changes to project roles may need to log out and in again for changes to take effect',
      },
      10_000
    )

    return redirect(`/pipelines`, { headers })
  }

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)

  const pipelineRes = await api(data, `/pipeline/${params.id}`)
  const usersRes = await api(data, `/organisation/${sessionData.activeOrganisation.id}/users`)

  const pipeline = await pipelineRes.json()
  const users = await usersRes.json()

  return json({
    pipeline,
    users,
    sessionData,
  })
}

const EditPipeline = () => {
  const { pipeline, users, sessionData } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  const fields = withValues(formFields(sessionData), {
    ...pipeline,
  })

  return (
    <Content title={pipeline.name}>
      <Form submitText="Save changes" fields={fields} errors={errors} transition={transition} />

      <Section title="Danger zone" className="mt-8">
        <Button color="danger" text="Delete pipeline" />
      </Section>
    </Content>
  )
}
export default EditPipeline
