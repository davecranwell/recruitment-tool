import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'
import type { FieldDef } from 'app/components/Forms'
import FormLayout from 'app/components/Forms'
import { requireAuth } from 'app/sessions.server'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const result = await api(data, '/position', 'POST', body)

  if (result.ok) return redirect('/positions')

  return result
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await requireAuth(request)

  const fields: FieldDef[] = [
    {
      name: 'name',
      required: true,
      label: 'Position Name',
      type: 'text',
      defaultValue: '',
    },
    {
      name: 'weee',
      required: true,
      label: 'Position Name',
      type: 'select',
      options: ['foo', 'bar', 'baz'],
      defaultValue: 'bar',
    },
    {
      name: 'row1',
      type: 'row',
      cols: 4,
      content: [
        {
          name: 'openingDate',
          colspan: 4,
          label: 'Opening date',
          type: 'date',
        },
        {
          name: 'closingDate',
          colspan: 4,
          label: 'Closing date',
          type: 'date',
        },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea', size: 3 },
    { name: 'organisationId', type: 'hidden', defaultValue: session.activeOrganisation.id },
  ]

  return json(fields)
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
