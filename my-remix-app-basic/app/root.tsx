import { json } from '@remix-run/node'
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { getUserSession } from 'app/sessions.server'

import styles from './tailwind.css'

import Layout from 'app/components/layout'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600&display=swap',
    rel: 'stylesheet',
  },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request)
  return json(session.has('user'))
}

export default function App() {
  const hasSession = useLoaderData()

  return (
    <html lang="en" className={`h-full ${!hasSession ? 'bg-gray-50' : ''}`}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  )
}
