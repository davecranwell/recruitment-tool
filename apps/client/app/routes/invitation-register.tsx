import { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { api } from 'app/api.server'
import { hasSession, createSession } from 'app/sessions.server'
import { safeRedirect, toSentence } from 'app/utils'
import { UnauthorisedResponse } from '~/utils/errors'

import Button from 'app/components/Button'
import Form, { withValues } from 'app/components/Forms'
import Divider from '~/components/Divider'

import { newUserFormFields } from '~/models/users/form'
import GoogleLogin from 'app/components/GoogleLogin'
import logo from '../../images/logo.svg'

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const session = await hasSession(request)

  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  // const { request } = data

  const invitation = await api(data, `/invitation/check/?token=${token}`)
  if (!invitation.ok) throw UnauthorisedResponse()

  return json({
    session,
    invitation: await invitation.json(),
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
  })
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
    : await api(data, `/authentication/register/invitation`, 'POST', {
        name: body.get('name'),
        password: body.get('password'),
        passwordConfirmation: body.get('passwordConfirmation'),
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
                      action={`/invitation-register?token=${token}`}
                      wrapper="none"
                      submitWidth="full"
                      submitText="Register your account"
                      intro="Create an account below to accept your invitation"
                      fields={withValues(newUserFormFields(), { email: invitation.email, token })}
                      errors={errors}
                      transition={transition}
                    />

                    <Divider text="Or" />
                    <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
                      <GoogleLogin text="Register with Google" extraData={{ token }} />
                    </GoogleOAuthProvider>

                    <Divider text="If you've already got an account" className="py-8" />
                    <Link to={`/invitation-sign-in?token=${token}`}>
                      <Button text="Sign in to accept invitation" color="secondary" width="full" />
                    </Link>
                  </div>
                </div>
                {/* <div className="border-l-4 border-gray-100">
              
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
