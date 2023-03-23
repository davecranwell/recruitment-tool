import { Response } from '@remix-run/node'

export const UnauthorisedResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Unauthorised', {
    status: 401,
    statusText: 'Access Unauthorised',
    headers,
  })

export const ForbiddenResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Forbidden', {
    status: 403,
    statusText: 'Access Forbidden',
    headers,
  })

export const NotFoundResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Not found', {
    status: 404,
    statusText: 'Page Not Found',
    headers,
  })

export const ErrorResponse = ({
  status,
  headers,
  statusText,
}: {
  status: number
  headers?: Headers
  statusText: string
}) =>
  new Response('An error occured', {
    status: status || 500,
    statusText: `An unexpected error occured: "${statusText}"`,
    headers,
  })

export const RateLimitedResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Too many requests', {
    status: 429,
    statusText: 'Too Many Requests',
    headers,
  })
