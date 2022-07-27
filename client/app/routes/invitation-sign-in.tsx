import { useActionData, useTransition, useSearchParams, useLoaderData, Link } from '@remix-run/react'
import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { createSession, hasSession } from 'app/sessions.server'
import { api, jsonWithHeaders } from 'app/api.server'
import { safeRedirect, toSentence } from 'app/utils'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import Form, { withValues } from 'app/components/Forms'

import { loginFields, newUserFormFields } from '~/models/users/form'

import { UnauthorisedResponse } from '~/utils/errors'
import { json } from 'express'
import SignInForm from '~/components/SignInForm'
import Divider from '~/components/Divider'

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

  const token = searchParams.get('token') ?? undefined

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-900">You've received an invitation</h2>
          <p className="mt-2 font-medium">
            <span>
              You're invited to join <strong>{invitation.organisation.name}</strong> with a{' '}
              <strong>{toSentence(invitation.role)}</strong> role.
            </span>
          </p>

          {session ? (
            <Button type="button" text="Accept invitation" />
          ) : (
            <>
              <div className="mt-8 shadow sm:mx-auto sm:w-full sm:max-w-md sm:overflow-hidden sm:rounded-lg">
                <div className="bg-white py-6 px-6 sm:p-6">
                  <Form
                    name="foo"
                    wrapper="none"
                    submitText="Sign in"
                    submitWidth="full"
                    intro={<p className="text-base">Sign in to accept your invitation</p>}
                    fields={withValues(loginFields(), { email: invitation.email, token: searchParams.get('token') })}
                    errors={errors}
                    transition={transition}
                  />
                  <Divider text="Or if you don't have an account yet" className="py-8" />
                  <Link to={`/invitation-register?token=${token}`}>
                    <Button text="Register now" color="secondary" width="full" />
                  </Link>
                </div>
              </div>
              {/* <div className="border-l-4 border-gray-100">
                <Form
                  submitText="Register your account"
                  intro="Create an account below to accept your invitation"
                  fields={withValues(newUserFormFields(), { email: invitation.email })}
                  errors={errors}
                  transition={transition}
                />
              </div> */}
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default AcceptInvitation
