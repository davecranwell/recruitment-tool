import classNames from 'classnames'

import type { User } from '~/models/users/User'
import Avatar from './Avatar'

export type Props = {
  user: User
  children?: any
}

const PersonHeader: React.FC<Props> = ({ children, user }) => {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex items-center space-x-5">
        <div className="flex-shrink-0">
          <Avatar name={user.name} imageUrl={user.avatarUrl} size="lg" />

          {/* <div className="relative">
            <img
              className="h-16 w-16 rounded-full"
              src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt=""
            />
            <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
          </div> */}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          {/* <p className="font-medium text-gray-500">
                Applied for{' '}
                <a href="#" className="text-gray-900">
                  Front End Developer
                </a>{' '}
                on <time dateTime="2020-08-25">August 25, 2020</time>
              </p> */}
        </div>
      </div>

      {children}
    </div>
  )
}

export default PersonHeader
