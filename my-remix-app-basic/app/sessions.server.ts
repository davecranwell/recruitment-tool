import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import invariant from 'tiny-invariant'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')

type SessionData = {
  user: {
    id: number
    name: string
    email: string
  }
  accessToken: string
  refreshToken: string
  activeOrganisationId: number
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: '__session',
    expires: new Date(Date.now() + 60_000 * 60 * 24),
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: true,
  },
})

export async function createSession(authRecord: any, redirectTo: string) {
  const session = await getSession()

  const redirectChoice = authRecord.user.organisations.length > 1 ? '/choose-organisation' : redirectTo

  session.set('user', authRecord)

  return redirect(redirectChoice, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function setSessionOrganisation(request: Request, organisationId: number, redirectTo: string) {
  const session = await getUserSession(request)
  const user = session.get('user')

  user.activeOrganisationId = organisationId
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

export async function refreshTokensInHeaders(request: Request) {
  const session = await getUserSession(request)
  const { refreshToken, accessToken } = session.get('user')

  // no processing of the json can occur here for reasons I can't explain
  // we have to pass the whole response back
  const refreshRes = await fetch(`${process.env.BACKEND_ROOT_URL}/authentication/refresh`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  })

  session.set('user', await refreshRes.json())
  return new Headers({
    'Set-Cookie': await commitSession(session),
  })
}

export async function getSessionData(request: Request): Promise<SessionData> {
  const session = await getUserSession(request)
  return session.get('user')
}

export async function hasSession(request: Request) {
  const session = await getUserSession(request)
  return session.has('user')
}

export async function requireAuth(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session = await getUserSession(request)
  const user = session.get('user')

  if (!user) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/sign-in?${searchParams}`)
  }

  const url = new URL(request.url)

  if (url.pathname !== '/choose-organisation' && !user.activeOrganisationId) {
    throw redirect(`/choose-organisation`)
  }

  return user
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

export { getSession, commitSession, destroySession }
