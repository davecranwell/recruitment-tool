import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { useActionData, useFetcher, useSearchParams, useTransition } from '@remix-run/react'
import { useGoogleLogin } from '@react-oauth/google'
import { redirect } from '@remix-run/node'

import { api } from 'app/api.server'
import { createSession, hasSession } from 'app/sessions.server'
import { safeRedirect } from 'app/utils'

import { loginFields } from '~/models/users/form'

import Form from 'app/components/Forms'
import Button from '~/components/Button'
import Divider from '~/components/Divider'

import googlelogo from '../../images/GoogleLogo.svg'

export const loader: LoaderFunction = async ({ request }) => {
  if (await hasSession(request)) {
    return redirect('/')
  }

  return null
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
  const fetcher = useFetcher()
  const errors = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  const redirectTo = searchParams.get('redirectTo') ?? undefined

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      fetcher.submit({ googleResponse: JSON.stringify(codeResponse) }, { method: 'post' })
    },
    ux_mode: 'redirect',
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
  })

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-primary-600.svg"
            alt="Workflow"
          /> */}
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
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

              <Button
                color="secondary"
                width="full"
                text="Sign in with Google"
                icon={<img src={googlelogo} alt="" className="mr-2 flex h-6 w-6" />}
                onClick={() => googleLogin()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignIn
