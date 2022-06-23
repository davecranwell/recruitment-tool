import {
  BellIcon,
  CalendarIcon,
  CogIcon,
  FolderIcon,
  HomeIcon,
  MenuAlt2Icon,
  UserGroupIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline'
import { Dialog, Menu, Transition } from '@headlessui/react'
import type { MouseEventHandler } from 'react'

import UserNav from './UserNav'

type Props = {
  userNavigation: any[]
  onSidebarOpen: MouseEventHandler
}

const MobileTopNav: React.FC<Props> = ({ userNavigation, onSidebarOpen }) => {
  return (
    <div className="bg-white shadow md:hidden">
      <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={onSidebarOpen}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4 md:px-0">
            <div className="flex flex-1">
              {/* <form className="flex w-full md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <SearchIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      id="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form> */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* <button
                    type="button"
                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

              <UserNav
                navItems={userNavigation}
                positionClasses="right-0 w-48"
                button={() => (
                  <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </Menu.Button>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileTopNav
