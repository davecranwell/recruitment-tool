import { json, LoaderArgs, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import type { Organisation } from 'app/models/organisation/Organisation'
import { toSentence } from '~/utils'
import { api } from '~/api.server'
import Avatar from 'app/components/Avatar'

export const loader = async (data: LoaderArgs) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  const orgs = await api(data, `/user/${sessionData.user.id}/organisations`)

  return json({ organisations: await orgs.json(), sessionData })
}

const ChooseOrganisation = () => {
  const { organisations } = useLoaderData<typeof loader>()

  return (
    <div className="flex min-h-full justify-center py-12 sm:px-6 lg:px-8">
      <Content title={'Choose an organisation to continue'}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {organisations.map((org: Organisation) => (
            <div
              key={org.organisation.id}
              className="focus-within:ring-primary-500 relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400"
            >
              <div className="flex-shrink-0">
                {/* <img className="h-10 w-10 rounded-full" src={organisation.imageUrl} alt="" /> */}
              </div>
              <nav className="min-w-0 flex-1" aria-describedby="content-title">
                <Link to={`/choose-organisation/${org.organisation.id}`} className="focus:outline-none">
                  <div className="flex space-x-5">
                    {org.organisation.logo && (
                      <div className="flex-shrink-0">
                        <Avatar
                          name={org.organisation.name}
                          imageUrl={`https://${org.organisation.logo.bucket}.s3.eu-north-1.amazonaws.com/thumbnails/${org.organisation.logo.key}`}
                          size="xl"
                        />
                      </div>
                    )}
                    <div className="mt-0 pt-1 text-left">
                      <p className="text-xl font-medium text-gray-900">{org.organisation.name}</p>
                      <p className="truncate text-sm text-gray-500">{toSentence(org.role)}</p>
                    </div>
                  </div>
                </Link>
              </nav>
            </div>
          ))}
        </div>
      </Content>
    </div>
  )
}
export default ChooseOrganisation
