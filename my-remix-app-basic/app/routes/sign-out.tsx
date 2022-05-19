import type { LoaderFunction } from '@remix-run/node'

import { logout } from 'app/sessions.server'

export const loader: LoaderFunction = async ({ request }) => {
  return await logout(request)
}
