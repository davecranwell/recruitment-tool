import type { AppLoadContext, DataFunctionArgs, Session } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'

import type { SessionData } from 'app/sessions.server'
import { commitSession, getSessionData, getSessionFromCookie, sessionAccessTokenHasExpired } from 'app/sessions.server'
import { formDataToJson } from 'app/utils'
import { ErrorResponse, ForbiddenResponse, NotFoundResponse } from 'app/utils/errors'

// One of the purposes of this new file is to encapsulate all the sessions setting stuff we need to be able to do in a loader or action
// In particular we need to be able to return the session and set the cookie all in the action/header easily.
// Something like https://github.com/remix-run/examples/blob/main/toast-message/app/routes/index.tsx

export class Api {
  session?: Session

  async initSession(data: DataFunctionArgs) {
    const { request, context } = data

    this.session = await getSessionFromCookie(request)

    if (this.getSessionData() && this.hasAccessTokenExpired()) {
      return this.refreshAndCache(context)
    }
  }

  getHeaders() {
    return commitSession(this.session!).then((cookie) => {
      return new Headers({ 'Set-Cookie': cookie })
    })
  }

  getSession() {
    return this.session
  }

  private getSessionData(): SessionData {
    return this.session?.get('user')
  }

  async fetch({ url, method = 'GET', body }: { url: string; method?: string; body?: any }): Promise<any> {
    const { accessToken } = this.getSessionData() || {}

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
        throw NotFoundResponse()

      case 403:
        throw ForbiddenResponse()

      case 500:
        throw ErrorResponse({ statusText: apiRes.statusText })
    }

    // status is important as 400 errors (bad request) are used for form validation
    return json(await apiRes.json(), { status: apiRes.status })
  }

  private async fetchRefreshToken() {
    return fetch(`${process.env.BACKEND_ROOT_URL}/authentication/refresh`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getSessionData()?.refreshToken}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json()
        throw redirect('/sign-out')
      })
      .then(({ accessToken, refreshToken }) => {
        const sessionData = this.getSessionData()

        sessionData.accessToken = accessToken
        sessionData.refreshToken = refreshToken
        this.session!.set('user', sessionData)
      })
  }

  private async refreshAndCache(context: AppLoadContext): Promise<any> {
    const sessionData = this.getSessionData()

    const cachedRefreshPromise = context.cache[sessionData.user?.id]
    if (cachedRefreshPromise) return cachedRefreshPromise

    // we cache the promise returned from getRefreshToken which is async
    // then return the cache WITHOUT awaiting anything - limiting us to one level of promises
    context.cache[sessionData.user.id] = this.fetchRefreshToken()

    setTimeout(() => {
      // delete this cache after 20s because no request could ahve taken that long
      if (sessionData) delete context.cache[sessionData.user.id]
    }, 20_000)

    return context.cache[sessionData.user.id]
  }

  private hasAccessTokenExpired() {
    const { accessToken } = this.getSessionData()

    if (!accessToken) return false

    const expiry = (jwt.decode(accessToken) as JwtPayload).exp
    if (new Date().getTime() > expiry! * 1000) {
      return true
    }

    return false
  }
}
