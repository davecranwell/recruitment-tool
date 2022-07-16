import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import invariant from 'tiny-invariant'

import type { Organisation } from '~/models/organisation/Organisation'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')
invariant(process.env.SESSION_EXPIRATION_TIME, 'SESSION_EXPIRATION_TIME must be set')

export type SessionData = {
  user: {
    id: number
    name: string
    email: string
    organisations: any[]
    abilities: any[]
  }
  accessToken: string
  refreshToken: string
  activeOrganisation: Organisation
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: '__session',
    maxAge: +process.env.SESSION_EXPIRATION_TIME,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

export async function createSession(authRecord: SessionData, redirectTo: string) {
  const session = await getSession() // empty session

  const redirectChoice = authRecord.user.organisations.length > 1 ? '/choose-organisation' : redirectTo

  if (authRecord.user.organisations.length === 1) {
    authRecord.activeOrganisation = authRecord.user.organisations[0].organisation
  }

  session.set('user', authRecord)

  return redirect(redirectChoice, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function setSessionOrganisation(request: Request, organisation: Organisation, redirectTo: string) {
  const session = await getUserSession(request)
  const user = session.get('user')

  user.activeOrganisation = organisation
  session.set('user', user)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function getUserSession(request: Request) {
  return await getSession(request.headers.get('Cookie'))
}

export function sessionAccessTokenHasExpired(session: Session) {
  if (session.has('user')) {
    const { accessToken } = session.get('user')

    const expiry = (jwt.decode(accessToken) as JwtPayload).exp
    if (new Date().getTime() > expiry! * 1000) {
      return true
    }
  }
  return false
}

export async function getRefreshToken(request: Request) {
  const session = await getUserSession(request)
  const currentSession = session.get('user')

  return fetch(`${process.env.BACKEND_ROOT_URL}/authentication/refresh`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${currentSession.refreshToken}`,
    },
  })
    .then((res) => {
      if (res.ok) return res.json()
      throw redirect('/sign-out')
    })
    .then(({ accessToken, refreshToken }) => {
      // replace only the tokens.
      currentSession.accessToken = accessToken
      currentSession.refreshToken = refreshToken

      session.set('user', currentSession)

      return commitSession(session).then((cookie) => {
        return {
          refreshedAccessToken: accessToken,
          headers: new Headers({ 'Set-Cookie': cookie }),
        }
      })
    })
}

export async function refreshTokensIfNeeded(request: Request, context: any) {
  const session = await getUserSession(request)
  const currentSession = session.get('user')

  // if session still active, send empty headers to tack onto next appropriate request
  if (!sessionAccessTokenHasExpired(session)) return { headers: new Headers() }

  const cachedRefreshPromise = context.cache[currentSession?.user?.id]
  if (cachedRefreshPromise) return cachedRefreshPromise

  context.cache[currentSession.user.id] = getRefreshToken(request)

  setTimeout(() => {
    // delete this cache after 20s because no request could ahve taken that long
    delete context.cache[currentSession.user.id]
  }, 20_000)

  return context.cache[currentSession.user.id]
}

export async function getSessionData(request: Request): Promise<SessionData> {
  const session = await getUserSession(request)
  return session.get('user')
}

export async function hasSession(request: Request): Promise<boolean> {
  const session = await getUserSession(request)
  return session.has('user')
}

export async function requireAuth(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const sessionData: SessionData = await getSessionData(request)

  if (!sessionData) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/sign-in?${searchParams}`)
  }

  const url = new URL(request.url)

  if (!sessionData.activeOrganisation && url.pathname !== '/choose-organisation') {
    throw redirect(`/choose-organisation`)
  }

  return sessionData
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/start', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

export { getSession, commitSession, destroySession }
