import type { ActionFunction, LoaderArgs, MetaFunction } from '@remix-run/node'
import { json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from '@remix-run/node'

import { useActionData, useLoaderData, useMatches, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import { editFormFields } from '~/models/organisation/form'

import Form, { withValues } from 'app/components/Forms'
import Breadcrumb from '~/components/Breadcrumb'
import Content from '~/components/Content'
import ContentBanner from '~/components/ContentBanner'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  // This deletes the formData part for the file, if it doesn't correspond to the required filter/maxpartsize
  // NB: for the filter to pass for the multipart "part" containing the file, it also has to pass for
  // the part containing the data, so we must do a basic guard check in the filter to automatically
  // pass it for non-file contents, otherwise the data is deleted too
  const uploadHandler = unstable_createMemoryUploadHandler({
    filter: ({ filename, contentType }) => !filename || /(png|jpg|jpeg)$/.test(contentType),
    maxPartSize: 1000000,
  })

  try {
    const body = await unstable_parseMultipartFormData(request, uploadHandler)
    const result = await api(data, `/organisation/${sessionData.activeOrganisation.id}`, 'PATCH', body, {
      rawBody: true,
    })

    if (result.ok) return redirect('/')
  } catch (e) {
    return {
      error: 'Bad Request',
      message: [
        {
          property: 'file',
          constraints: {
            error: 'Your chosen logo was not of the allowed type or size.',
          },
        },
      ],
      statusCode: 400,
    }
  }

  return null
}

export const loader = async (data: LoaderArgs) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)

  const organisationReq = await api(data, `/organisation/${sessionData.activeOrganisation.id}`)
  const organisation = await organisationReq.json()

  return json({ sessionData, region: process.env.AWS_S3_REGION, organisation })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Organisation settings` }
}

const Settings = () => {
  const { sessionData, organisation, region } = useLoaderData<typeof loader>()
  const matches = useMatches()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <div className="space-y-4">
      <ContentBanner title={'Organisation settings'}>
        <Breadcrumb matches={matches} />
      </ContentBanner>
      <Content titleSize="larger">
        {/* <img src={thumbnailUrl} className="h-[150]" /> */}
        <Form
          submitText="Upload"
          fields={withValues(editFormFields(sessionData, { region }), organisation)}
          errors={errors}
          transition={transition}
          encType="multipart/form-data"
        />
      </Content>
    </div>
  )
}
export default Settings
