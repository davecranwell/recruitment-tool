import { Outlet, useLoaderData } from '@remix-run/react'
import { requireAuth } from 'app/sessions.server'
import Layout from '~/components/Layout'

export async function loader({ request }: { request: Request }) {
  return await requireAuth(request)
}

export default function Authenticated() {
  const session = useLoaderData()

  return (
    <div>
      <Layout session={session}>
        <Outlet context={session} />
      </Layout>
    </div>
  )
}
