import { Response } from '@remix-run/node'

export const UnauthorisedResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Unauthorised', {
    status: 401,
    statusText: 'Unauthorised',
    headers,
  })

export const ForbiddenResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Forbidden', {
    status: 403,
    statusText: 'Forbidden',
    headers,
  })

export const NotFoundResponse = ({ headers }: { headers?: Headers } = {}) =>
  new Response('Not found', {
    status: 404,
    statusText: 'Not Found',
    headers,
  })

export const ErrorResponse = ({ headers, statusText }: { headers?: Headers; statusText: string }) =>
  new Response(`An error occured: "${statusText}"`, {
    status: 500,
    statusText: `An error occured: "${statusText}"`,
    headers,
  })
