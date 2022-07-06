import type { DataFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'

import { getSession, refreshTokensIfNeeded } from 'app/sessions.server'
import { formDataToJson } from 'app/utils'
import { ErrorResponse, ForbiddenResponse, NotFoundResponse } from 'app/utils/errors'

export async function api(data: DataFunctionArgs, url: string, method: string = 'GET', body?: any): Promise<any> {
  const { request, context } = data

  const session = await getSession(request.headers.get('Cookie'))
  let accessToken = session?.get('user')?.accessToken

  // Refresh token of existing session first before attempting API request
  const { headers, refreshedAccessToken } = await refreshTokensIfNeeded(request, context)
  if (!headers) return redirect('/sign-out')

  // We won't have accessToken or a session if we're not logging in.
  // NB: the accessToken may have just this instant been refreshed by refreshTokensIfNeeded()
  // but it is yet to be committed to the cookie, done by setting headers at the very
  // end of this function.
  if (refreshedAccessToken) accessToken = refreshedAccessToken

  const apiRes = await fetch(`${process.env.BACKEND_ROOT_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body instanceof FormData ? JSON.stringify(formDataToJson(body)) : JSON.stringify(body),
  })

  switch (apiRes.status) {
    // NB: can't catch 400 here as 400 is a bad request i.e a request that had errors to be returned to user
    case 404:
      throw NotFoundResponse({ headers })

    case 403:
      throw ForbiddenResponse({ headers })

    case 500:
      throw ErrorResponse({ headers, statusText: apiRes.statusText })
  }

  return json(await apiRes.json(), { status: apiRes.status, headers })
}
