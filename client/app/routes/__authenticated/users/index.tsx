import { UserIcon } from '@heroicons/react/outline'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'

import { api } from 'app/api.server'
import type { SessionData } from '~/sessions.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Avatar from 'app/components/Avatar'
import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import type { UserInOrganisation } from 'app/models/users/User'

export const meta: MetaFunction = ({ data }) => {
  return { title: `Users in ${data?.sessionData?.activeOrganisation?.name}` }
}

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  await requireAuth(request)
  const sessionData = await getSessionData(request)

  return await api(data, `/organisation/${sessionData.activeOrganisation.id}/users`)
}

const Users = () => {
  const sessionData = useOutletContext<SessionData>()
  const users = useLoaderData()

  const { can, subject } = useAppAbility()

  const canCreateProject = can('manage', subject('Organisation', sessionData?.activeOrganisation))

  return (
    <Content
      title={'Users'}
      primaryAction={
        users.data.length &&
        canCreateProject && {
          label: 'Invite',
          link: '/users/invite',
        }
      }
    >
      <StackedList
        items={users.data}
        fallback={() => (
          <Empty
            icon={UserIcon}
            title={'No users have been added'}
            createText={'Invite some now '}
            createLink={canCreateProject ? '/users/invite' : null}
          />
        )}
      >
        {users.data.map((user: UserInOrganisation) => (
          <StackedListItem key={user.user.id} link={`/users/${user.user.id}/edit`}>
            <div className="flex min-w-0 flex-1 items-center">
              <Avatar name={user.user.name} size="m" />
              <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                <div>
                  <p className="text-primary-600 truncate text-sm font-medium">{user.user.name}</p>
                  <p className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">{user.user.email}</span>
                  </p>
                </div>
                <div className="flex hidden items-center md:block">
                  <div>
                    <p className="text-sm text-gray-900">{user.role.toLowerCase().replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </StackedListItem>
        ))}
      </StackedList>

      <Outlet />
    </Content>
  )
}
export default Users
