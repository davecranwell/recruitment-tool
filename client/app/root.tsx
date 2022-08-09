import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import styles from './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap',
    rel: 'stylesheet',
  },
]

export const loader: LoaderFunction = async ({ request }) => {
  return json({ GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID })
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  const { GOOGLE_AUTH_CLIENT_ID } = useLoaderData()

  return (
    <html lang="en" className="bg-secondary-100 h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full text-slate-800">
        <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
          <Outlet />
        </GoogleOAuthProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  )
}
