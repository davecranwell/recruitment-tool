import { useActionData, useTransition, useSearchParams, useLoaderData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { createSession, hasSession } from 'app/sessions.server'
import { api, jsonWithHeaders } from 'app/api.server'
import { safeRedirect, toSentence } from 'app/utils'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import Form, { withValues } from 'app/components/Forms'

import { newUserFormFields } from '~/models/users/form'

import { UnauthorisedResponse } from '~/utils/errors'
import { json } from 'express'

export const meta: MetaFunction = () => {
  return { title: `Accept invitation` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const session = await hasSession(request)

  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  // const { request } = data

  const invitation = await api(data, `/invitation/check/?token=${token}`)
  if (!invitation.ok) throw UnauthorisedResponse()

  return jsonWithHeaders({ session, invitation })
}

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const redirectTo = safeRedirect(body.get('redirectTo'), '/')

  const authentication = await api(data, '/authentication/log-in', 'POST', {
    email: body.get('email'),
    password: body.get('password'),
  })

  if (authentication.ok) {
    return createSession(await authentication.json(), redirectTo)
  }

  return authentication
}

const AcceptInvitation = () => {
  const { session, invitation } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  //const redirectTo = searchParams.get('redirectTo') ?? undefined

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">You've received an invitation</h2>
          <p>
            You've been invited to join <strong>{invitation.organisation.name}</strong> with a{' '}
            <strong>{toSentence(invitation.role)}</strong> role.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {session ? (
            <Button type="button" text="Accept invitation" />
          ) : (
            <Form
              submitText="Register your account"
              intro="Create an account below to accept your invitation"
              fields={withValues(newUserFormFields(), { email: invitation.email })}
              errors={errors}
              transition={transition}
            />
          )}
        </div>
      </div>
    </>
  )
}
export default AcceptInvitation
