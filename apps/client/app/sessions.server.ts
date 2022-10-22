import type { Session } from '@remix-run/node'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'

// import { notify } from '~/components/Notifications'
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
  //dir: 'sessions',
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

export async function getSessionFromCookie(request: Request) {
  return await getSession(request.headers.get('Cookie'))
}

export async function getSessionData(request: Request): Promise<SessionData> {
  const session = await getSessionFromCookie(request)
  return session.get('user')
}

export async function hasSession(request: Request): Promise<boolean> {
  const session = await getSessionFromCookie(request)
  return session.has('user')
}

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
  const session = await getSessionFromCookie(request)
  const user = session.get('user')

  user.activeOrganisation = organisation
  session.set('user', user)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function requireAuth(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session: Session = await getSessionFromCookie(request)
  const sessionData: SessionData = await getSessionData(request)

  if (!sessionData) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/sign-in?${searchParams}`)
  }

  const url = new URL(request.url)

  if (!sessionData.activeOrganisation && url.pathname !== '/choose-organisation') {
    throw redirect(`/choose-organisation`)
  }

  return { sessionData, session }
}

export async function logout(request: Request) {
  const session = await getSessionFromCookie(request)
  return redirect('/start', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

async function createNotice(session: Session, message: string, type: string, ttl: number = 3000) {
  session.flash('global', {
    type,
    message,
    ttl,
  })

  return { 'Set-Cookie': await commitSession(session) }
}

export function notify(session: Session) {
  return {
    success: async (message: string, ttl?: number) => await createNotice(session, message, 'success', ttl),
    error: async (message: string, ttl: number = 0) => await createNotice(session, message, 'error', ttl),
    warning: async (message: string, ttl: number = 5000) => await createNotice(session, message, 'warning', ttl),
    info: async (message: string, ttl?: number) => await createNotice(session, message, 'info', ttl),
  }
}

export { getSession, commitSession, destroySession }
