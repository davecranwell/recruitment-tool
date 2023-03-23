import type { DataFunctionArgs, TypedResponse } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getClientIPAddress } from 'remix-utils'

import { getSessionData } from 'app/sessions.server'
import { formDataToJson } from 'app/utils'
import { ErrorResponse, ForbiddenResponse, NotFoundResponse, RateLimitedResponse } from 'app/utils/errors'

type Options = {
  rawBody?: boolean
}

export async function api<T>(
  data: DataFunctionArgs | null,
  url: string,
  method: string = 'GET',
  body?: any,
  options?: Options
) {
  const { request } = data || {}
  const { accessToken } = (request && (await getSessionData(request))) || {}

  const bodyJsonStringified = body instanceof FormData ? JSON.stringify(formDataToJson(body)) : JSON.stringify(body)

  const clientIP = request && getClientIPAddress(request)

  const apiRes = await fetch(`${process.env.BACKEND_ROOT_URL}${url}`, {
    method,
    headers: {
      // https://stackoverflow.com/questions/40351429/formdata-how-to-get-or-set-boundary-in-multipart-form-data-angular
      // it seems that  setting the content-type to multipart/form-data is not allowed, so its removed entirely
      // and left to the library to fetch() to figure out itself.
      // In this situation we have to pass a raw body anyway, so we hide the content type if a rawbody is used.
      ...(!options?.rawBody && { 'Content-Type': 'application/json' }),
      ...(clientIP && { 'X-Forwarded-For': clientIP }),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: options?.rawBody ? body : bodyJsonStringified,
  })

  const returnData = await apiRes.json()

  switch (apiRes.status) {
    case 401:
      // Logged in users (those with an access token) should get logged out if they experience a 401
      // anyone without an accesstoken should see the error message
      if (accessToken) throw redirect('/sign-out')
      return json(returnData, { status: apiRes.status })

    // NB: can't catch 400 here as 400 is a bad request i.e a request that had errors to be returned to user
    case 404:
      throw NotFoundResponse()

    case 403:
      throw ForbiddenResponse()

    case 429:
      throw RateLimitedResponse()

    case 409:
    case 500:
      throw ErrorResponse({ status: apiRes.status, statusText: apiRes.statusText })
  }

  return json(returnData as T, { status: apiRes.status }) as TypedResponse<T>
}
