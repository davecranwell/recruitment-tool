import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { api } from 'app/api.server'
import { createSession, hasSession } from 'app/sessions.server'

import Button from 'app/components/Button'
import Form, { withValues } from 'app/components/Forms'
import GoogleLogin from 'app/components/GoogleLogin'
import Divider from 'app/components/Divider'

import { safeRedirect, toSentence } from 'app/utils'
import { UnauthorisedResponse } from 'app/utils/errors'

import { loginFields, loginToAcceptInvitationFields } from 'app/models/users/form'

import logo from '../../images/logo2.svg'

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const session = await hasSession(request)

  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  const invitationRes = await api(data, `/invitation/check/?token=${token}`)
  if (!invitationRes.ok) throw UnauthorisedResponse()

  const invitation = await invitationRes.json()

  return json({ session, invitation, GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID })
}

export const meta: MetaFunction = () => {
  return { title: `Accept invitation` }
}

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const googleResponse = body.get('googleResponse') as string
  const redirectTo = safeRedirect(body.get('redirectTo'), '/')

  const authentication = googleResponse
    ? await api(data, `/authentication/register/invitation/google`, 'POST', {
        ...JSON.parse(googleResponse),
        token: body.get('token'),
      })
    : await api(data, `/authentication/log-in`, 'POST', {
        email: body.get('email'),
        password: body.get('password'),
        token: body.get('token'),
      })

  if (authentication.ok) {
    return createSession(await authentication.json(), redirectTo)
  }

  return authentication
}

const AcceptInvitation = () => {
  const { session, invitation, GOOGLE_AUTH_CLIENT_ID } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token') ?? undefined

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-6">
            <img src={logo} className="mx-auto h-7 w-auto flex" alt="AppliCan" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">You've received an invitation</h2>
          <p className="mt-2 font-medium">
            <span>
              You're invited to join the organisation <strong>{invitation.organisation.name}</strong> with the role of{' '}
              <strong>{toSentence(invitation.role)}</strong>.
            </span>
          </p>

          <div className="mt-8">
            {session ? (
              <div className="flex justify-center">
                <Button type="button" text="Accept invitation" />
              </div>
            ) : (
              <>
                <div className="shadow sm:mx-auto sm:w-full sm:max-w-md sm:overflow-hidden sm:rounded-lg">
                  <div className="bg-white py-6 px-6 sm:p-6">
                    <Form
                      name="foo"
                      wrapper="none"
                      submitText="Sign in"
                      submitWidth="full"
                      intro={<span className="text-base">Sign in to accept your invitation</span>}
                      fields={withValues(loginToAcceptInvitationFields(), {
                        email: invitation.email,
                        token: searchParams.get('token'),
                      })}
                      errors={errors}
                      transition={transition}
                    />
                    <Divider text="Or" />
                    <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
                      <GoogleLogin text="Sign in with Google" extraData={{ token }} />
                    </GoogleOAuthProvider>
                    <Divider text="Or if you don't have an account yet" className="py-8" />
                    <Link to={`/invitation-register?token=${token}`}>
                      <Button text="Register now to accept invitation" color="secondary" width="full" />
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
      </div>
    </>
  )
}
export default AcceptInvitation
