import { useActionData, useTransition, useSearchParams } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { createSession, hasSession } from 'app/sessions.server'
import { api } from 'app/api.server'
import { safeRedirect } from 'app/utils'

import { loginFields } from '~/models/users/form'

import Form from 'app/components/Forms'

export const loader: LoaderFunction = async ({ request }) => {
  if (await hasSession(request)) {
    return redirect('/')
  }

  return request
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

const SignIn = () => {
  const errors = useActionData()
  const transition = useTransition()
  const [searchParams] = useSearchParams()

  const redirectTo = searchParams.get('redirectTo') ?? undefined

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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignIn
