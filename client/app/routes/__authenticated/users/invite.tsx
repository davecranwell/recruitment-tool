import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import Form, { withValues } from 'app/components/Forms'

import { inviteUserformFields } from 'app/models/users/form'

export const action: ActionFunction = async (data) => {
  const { request } = data

  await requireAuth(request)
  const invitation = await api(data, `/invitation/`, 'POST', await request.formData())

  if (invitation.ok) return redirect(`/users`)

  return invitation
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data

  const { sessionData } = await requireAuth(request)

  return json({
    fields: withValues(inviteUserformFields(), { organisationId: sessionData.activeOrganisation.id }),
  })
}

const NewUser = () => {
  const { fields } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <Content title={'Invite a user to the organisation'}>
      <Form
        submitText="Send invitation"
        intro={
          <>
            We'll send your invitation to their email address so they can join with the role you give them, below.
            Invitations expire after <strong>2 days</strong>.
          </>
        }
        fields={fields}
        errors={errors}
        transition={transition}
      />
    </Content>
  )
}
export default NewUser
