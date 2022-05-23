import type { LoaderFunction } from '@remix-run/node'
import { api } from '~/api.server'
import { setSessionOrganisation } from '~/sessions.server'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { id } = params

  const organisation = await api(data, `/organisation/${id}`)

  if (organisation.ok) {
    // redirecting to '/' won't work because of the way the redirect withing
    // '/' itself performs a redirect. We have to choose another page.
    return setSessionOrganisation(request, await organisation.json(), '/start')
  }
}
