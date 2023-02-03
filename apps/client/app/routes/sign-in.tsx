import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useSearchParams, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { createSession, hasSession } from 'app/sessions.server'
import { safeRedirect } from 'app/utils'

import { loginFields } from '~/models/users/form'

import { GoogleOAuthProvider } from '@react-oauth/google'
import Form from 'app/components/Forms'
import GoogleLogin from 'app/components/GoogleLogin'
import Divider from '~/components/Divider'

import logo from '../../images/logo.svg'

export const loader: LoaderFunction = async ({ request }) => {
  if (await hasSession(request)) {
    throw redirect('/')
  }

  return json({ GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID })
}

export const action: ActionFunction = async (data) => {
  const { request } = data
  const body = await request.formData()

  const googleResponse = body.get('googleResponse') as string

  const redirectTo = safeRedirect(body.get('redirectTo'), '/')

  const authentication = await api(
    data,
    `/authentication/log-in${googleResponse ? '/google' : ''}`,
    'POST',
    googleResponse
      ? JSON.parse(googleResponse)
      : {
          email: body.get('email'),
          password: body.get('password'),
        }
  )

  if (authentication.ok) {
    return createSession(await authentication.json(), redirectTo)
  }

  return authentication
}

const SignIn = () => {
  const errors = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()
  const { GOOGLE_AUTH_CLIENT_ID } = useLoaderData()

  const redirectTo = searchParams.get('redirectTo') ?? undefined

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-6">
            <img src={logo} className="mx-auto h-7 w-auto flex" alt="AppliCan" />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <div className="mt-8 shadow sm:mx-auto sm:w-full sm:max-w-md sm:overflow-hidden sm:rounded-lg">
            <div className="bg-white py-6 px-6 sm:p-6">
              <Form
                wrapper="none"
                submitText="Sign in"
                submitWidth="full"
                fields={loginFields(redirectTo)}
                errors={errors}
                transition={transition}
              />
              <Divider text="Or" />
              <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
                <GoogleLogin />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignIn
