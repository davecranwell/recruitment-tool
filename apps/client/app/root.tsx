import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react'

import logo from '../images/logo2.svg'
import styles from './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@100;200;300;400;500;600;700;800&display=swap',
    rel: 'stylesheet',
  },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'AppliCan',
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

type ErrorPageProps = {
  title: string
  children?: any
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, children }) => {
  return (
    <html lang="en" className="bg-secondary-50 h-full">
      <head>
        <title>Oh no!</title>
        <Links />
      </head>
      <body className="h-full text-slate-800 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
        <img src={logo} alt="" className="flex h-6" />

        <h1 className="py-4 text-2xl font-bold text-gray-900 text-center">{title}</h1>
        <div className="text-center">{children}</div>

        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <ErrorPage title="An error occured">
      {process.env.NODE_ENV === 'development' && (
        <>
          <div>{error.message}</div>
          <div>{error.stack}</div>
        </>
      )}
    </ErrorPage>
  )
}

export function CatchBoundary() {
  const caught = useCatch()
  return <ErrorPage title={caught.statusText}>{caught.status}</ErrorPage>
}
