import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireAuth } from '~/sessions.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuth(request)

  return redirect('/positions')
}
export default function Index() {
  return <div>start</div>
}
