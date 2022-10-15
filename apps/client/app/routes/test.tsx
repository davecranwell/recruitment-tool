import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Api } from 'app/new-api.server'
import { getSessionFromCookie, notify } from '~/sessions.server'

export const loader: LoaderFunction = async (data) => {
  const api = new Api()
  await api.initSession(data)

  const positionOneRes = await api.fetch({ url: '/applicant-profile-for-position/1' })
  const allPositionsRes = await api.fetch({ url: '/applicant-profile-for-position' })

  const positionOne = await positionOneRes.json()
  const allPositions = await allPositionsRes.json()

  const session = api.getSession()
  notify(session!).success('Congrats')

  return json({ foo: 'bar', positionOne, allPositions }, { headers: await api.getHeaders() })
}
