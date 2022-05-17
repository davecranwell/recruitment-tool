import type { LoaderFunction } from '@remix-run/node'
import { setSessionOrganisation } from '~/sessions.server'

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params

  return setSessionOrganisation(request, +id!, '/')
}
