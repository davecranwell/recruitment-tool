import { FolderIcon, UserIcon } from '@heroicons/react/outline'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'

import { api } from 'app/api.server'
import type { SessionData } from '~/sessions.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import { useAppAbility } from 'app/hooks/useAppAbility'
import type { UserRoleType, User, UserInOrganisation } from 'app/models/users/User'
import { AtSymbolIcon } from '@heroicons/react/solid'

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
      {users.data.length < 1 && (
        <Empty
          Icon={UserIcon}
          title={'No users have been added'}
          createText={'Invite some now '}
          createLink={canCreateProject ? '/users/invite' : null}
        />
      )}
      {users.data.length > 0 && (
        <StackedList>
          {users.data.map((user: UserInOrganisation) => (
            <StackedListItem key={user.user.id} link={`/users/${user.user.id}/edit`}>
              <div className="flex min-w-0 flex-1 items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="truncate text-sm font-medium text-indigo-600">{user.user.name}</p>
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
      )}
      <Outlet />
    </Content>
  )
}
export default Users
