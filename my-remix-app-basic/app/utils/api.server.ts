import { json } from '@remix-run/node'
import { getSession, refreshTokensInHeaders, commitSession, sessionAccessTokenHasExpired } from 'app/sessions.server'

export async function api(request: Request, url: string, method: string = 'GET', body?: any): Promise<any> {
  const session = await getSession(request.headers.get('Cookie'))

  // Refresh token of existing session first before attempting API request
  const headers = (sessionAccessTokenHasExpired(session) && (await refreshTokensInHeaders(request))) || undefined

  // We won't have accessToken or a session if we're not logging in
  const { accessToken } = session?.get('user') || {}

  const apiRes = await fetch(`${process.env.BACKEND_ROOT_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(body),
  })

  return json(await apiRes.json(), { status: apiRes.status, headers })
}
