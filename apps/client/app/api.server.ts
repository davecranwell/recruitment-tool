import type { DataFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'

import { getSessionData } from 'app/sessions.server'
import { formDataToJson } from 'app/utils'
import { ErrorResponse, ForbiddenResponse, NotFoundResponse } from 'app/utils/errors'

export async function api(
  data: DataFunctionArgs | null,
  url: string,
  method: string = 'GET',
  body?: any
): Promise<any> {
  const { request } = data || {}

  const { accessToken } = (request && (await getSessionData(request))) || {}

  const bodyPayload = body instanceof FormData ? JSON.stringify(formDataToJson(body)) : JSON.stringify(body)

  const apiRes = await fetch(`${process.env.BACKEND_ROOT_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: bodyPayload,
  })

  switch (apiRes.status) {
    case 401:
      throw redirect('/sign-out')

    // NB: can't catch 400 here as 400 is a bad request i.e a request that had errors to be returned to user
    case 404:
      throw NotFoundResponse()

    case 403:
      throw ForbiddenResponse()

    case 500:
      throw ErrorResponse({ statusText: apiRes.statusText })
  }

  return json(await apiRes.json(), { status: apiRes.status })
}
