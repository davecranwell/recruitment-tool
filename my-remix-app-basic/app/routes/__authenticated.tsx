import { Outlet, useLoaderData } from '@remix-run/react'
import { requireAuth } from 'app/sessions.server'
import Layout from '~/components/layout'

export async function loader({ request }: { request: Request }) {
  return await requireAuth(request)
}

export default function Authenticated() {
  const user = useLoaderData()

  return (
    <div>
      <Layout>
        <Outlet context={user} />
      </Layout>
    </div>
  )
}
