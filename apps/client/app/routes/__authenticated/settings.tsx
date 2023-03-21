import type { ActionFunction, LoaderFunction, MetaFunction, LoaderArgs } from '@remix-run/node'
import { json, redirect, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from '@remix-run/node'

import { Form as RemixForm, useActionData, useLoaderData, useMatches, useParams, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import type { SessionData } from '~/sessions.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Breadcrumb from '~/components/Breadcrumb'
import Content from '~/components/Content'
import ContentBanner from '~/components/ContentBanner'
import Form, { withValues } from 'app/components/Forms'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  // this deletes the formData part for the file, if it doesn't correspond to the required filter/maxpartsize
  const uploadHandler = unstable_createMemoryUploadHandler({
    filter: ({ filename, contentType }) => /(png|jpg|jpeg)$/.test(contentType),
    maxPartSize: 100000,
  })
  const body = await unstable_parseMultipartFormData(request, uploadHandler)

  // we check if the file is still present since the uploadHandler may have deleted it
  if (!body.has('file')) {
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

  const result = await api(data, `/organisation/${sessionData.activeOrganisation.id}/logo`, 'PATCH', body, {
    // https://stackoverflow.com/questions/40351429/formdata-how-to-get-or-set-boundary-in-multipart-form-data-angular
    // it seems that even setting the content-type to multipart/form-data is not allowed, so its removed entirely
    // and left to the library to fetch() to figure out itself.
    noContentType: true,
    rawBody: body,
  })

  if (result.ok) return redirect('/')

  return null
}

export const loader = async (data: LoaderArgs) => {
  const { request, params } = data
  await requireAuth(request)
  const sessionData = await getSessionData(request)

  //const projects = await api(data, `/organisation/${sessionData.activeOrganisation.id}/projects`)

  //return json({ projects: await projects.json(), sessionData })

  const thumbnailRootUrl = `https://${process.env.AWS_S3_PUBLIC_BUCKET}.${process.env.AWS_S3_REGION}.amazonaws.com`

  return json({ sessionData, thumbnailRootUrl })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Create an Organisation` }
}

const Settings = () => {
  const { sessionData, thumbnailRootUrl } = useLoaderData<typeof loader>()
  const matches = useMatches()
  const errors = useActionData()
  const transition = useTransition()

  const fields = [
    {
      name: 'file',
      required: true,
      label: 'Organisation logo',
      type: 'file',
      defaultValue: '',
      hint: 'Allowed files: png, jpg or jpeg of no more than 1MB in size',
    },
    { name: 'organisationId', type: 'hidden', defaultValue: sessionData.activeOrganisation.id },
  ]

  return (
    <div className="space-y-4">
      <ContentBanner title={'Organisation settings'}>
        <Breadcrumb matches={matches} />
      </ContentBanner>
      <Content titleSize="larger">
        <img src={`${thumbnailRootUrl}/thumbnails/image_processing20201006-13504-1kx9542+(1).png`} width="150" />
        <Form
          submitText="Upload"
          fields={fields}
          errors={errors}
          transition={transition}
          encType="multipart/form-data"
        />
      </Content>
    </div>
  )
}
export default Settings
