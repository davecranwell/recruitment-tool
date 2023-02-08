import { UserIcon } from '@heroicons/react/outline'
import { json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'
import { getSessionData, requireAuth } from '~/sessions.server'

import Avatar from 'app/components/Avatar'
import Content from 'app/components/Content'
import Empty from 'app/components/Empty'
import { StackedList, StackedListItem } from 'app/components/StackedList'

import type { UserInOrganisation } from 'app/models/users/User'

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const { sessionData } = await requireAuth(request)

  const users = await api(data, `/organisation/${sessionData.activeOrganisation.id}/users`)

  return json({ users: await users.json(), sessionData })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Users in ${data?.sessionData?.activeOrganisation?.name}` }
}

const Users = () => {
  const { sessionData, users } = useLoaderData()

  return (
    <Content>
      <StackedList items={users.data} fallback={() => <Empty icon={UserIcon} title={'No users have been added'} />}>
        {users.data.map((user: UserInOrganisation) => (
          <StackedListItem key={user.user.id} link={`/users/${user.user.id}/edit`}>
            <div className="flex min-w-0 flex-1 items-center">
              <Avatar name={user.user.name} imageUrl={user.user.avatarUrl} size="m" />
              <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                <div>
                  <p className="text-primary-600 truncate font-medium">
                    {user.user.name}
                    {user?.user?.id === sessionData?.user?.id && <span className="text-slate-800">&nbsp;(You)</span>}
                  </p>
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
