import { json, redirect } from '@remix-run/node'

import { getSession, getRefreshTokenHeadersAsNecessary } from 'app/sessions.server'
import { formDataToJson } from 'app/utils'

export async function api(request: Request, url: string, method: string = 'GET', body?: any): Promise<any> {
  const session = await getSession(request.headers.get('Cookie'))

  // Refresh token of existing session first before attempting API request
  const headers = await getRefreshTokenHeadersAsNecessary(request)
  if (!headers) return redirect('/sign-out')

  // We won't have accessToken or a session if we're not logging in.
  // NB: the accessToken may have just this instant been refreshed by sessionAccessTokenHasExpired()
  // but it is yet to be committed to the cookie, done by setting headers at the very
  // end of this function.
  const { accessToken } = session?.get('user') || {}

  const apiRes = await fetch(`${process.env.BACKEND_ROOT_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: body instanceof FormData ? JSON.stringify(formDataToJson(body)) : JSON.stringify(body),
  })

  return json(await apiRes.json(), { status: apiRes.status, headers })
}
