import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import FormLayout from 'app/components/Forms'
import { requireAuth } from 'app/sessions.server'

import formFields from 'app/models/positions/form'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const result = await api(data, '/position', 'POST', body)

  if (result.ok) return redirect('/positions')

  return result
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuth(request)

  return json(formFields(session))
}

const NewPosition = () => {
  const fields = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={'Create a position'}>
      <FormLayout
        submitText="Create this position"
        intro="Lets create you a lovely new position"
        fields={fields}
        errors={errors}
        transition={transition}
      />
    </Content>
  )
}
export default NewPosition
