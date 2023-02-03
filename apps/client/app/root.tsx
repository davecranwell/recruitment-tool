import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useCatch } from '@remix-run/react'
import { GoogleOAuthProvider } from '@react-oauth/google'

import styles from './tailwind.css'
import logo from '../images/logo.svg'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap',
    rel: 'stylesheet',
  },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  return (
    <html lang="en" className="bg-secondary-50 h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full text-slate-800 ">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en" className="bg-secondary-50 h-full">
      <head>
        <title>Oh no!</title>
        <Links />
      </head>
      <body className="h-full text-slate-800 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
        <img src={logo} alt="" className="flex h-6" />

        <h1 className="text-2xl font-bold text-gray-900 text-center">An error occured</h1>
        {process.env.NODE_ENV === 'development' && error.message}
      </body>
      <Scripts />
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return (
    <html lang="en" className="bg-secondary-50 h-full ">
      <head>
        <title>Oh no!</title>
        <Links />
      </head>
      <body className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
        <img src={logo} alt="" className="flex h-10 mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  )
}
