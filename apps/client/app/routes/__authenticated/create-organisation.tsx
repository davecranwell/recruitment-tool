import type { ActionFunction, LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from '@remix-run/node'
import { useActionData, useLoaderData, useMatches, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { requireAuth } from '~/sessions.server'

import { newFormFields } from '~/models/organisation/form'

import Form from 'app/components/Forms'
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
    const result = await api(data, `/organisation`, 'POST', body, { rawBody: true })

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

export const loader: LoaderFunction = async (data: LoaderArgs) => {
  const { request, params } = data
  const { sessionData } = await requireAuth(request)
  return json({ sessionData })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Create an Organisation` }
}

const CreateOrganisation = () => {
  const { sessionData, thumbnailUrl } = useLoaderData<typeof loader>()
  const matches = useMatches()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <div className="space-y-4">
      <ContentBanner title={'Create your organisation'}>
        <Breadcrumb matches={matches} />
      </ContentBanner>
      <Content
        titleSize="larger"
        intro={`Start using AppliCan for your business by creating an organisation. You'll be given "organisation owner"
            level access and can create new positions in seconds.`}
      >
        <img src={thumbnailUrl} className="h-[150]" />
        <Form
          submitText="Create organisation"
          fields={newFormFields(sessionData)}
          errors={errors}
          transition={transition}
          encType="multipart/form-data"
        />
      </Content>
    </div>
  )
}
export default CreateOrganisation
