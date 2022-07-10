import { Menu } from '@headlessui/react'
import {
  BriefcaseIcon,
  CalendarIcon,
  CogIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/outline'
import { SelectorIcon } from '@heroicons/react/solid'
import type { SessionData } from '@remix-run/node'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { useAppAbility } from 'app/hooks/useAppAbility'
import MobileTopNav from './MobileTopNav'
import Sidebar from './Sidebar'
import SiteNav from './SiteNav'
import UserNav from './UserNav'

type Props = {
  children: React.ReactNode
  session?: SessionData
}

type NavItem = {
  name: string
  href?: string
  icon?: any
  type?: string
}

type NavItems = [NavItem[]]

const Layout: React.FC<Props> = ({ children, session }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { can, subject } = useAppAbility()

  const navigation: NavItems = [
    [
      { name: 'Home', href: '/start', icon: HomeIcon },
      { name: 'Applicants', href: '/applicant-profiles', icon: UsersIcon },

      { name: 'Positions', href: '/positions', icon: BriefcaseIcon },
      { name: 'Timeline', href: '/timeline', icon: CalendarIcon },
    ],
  ]

  if (can('manage', subject('Organisation', session?.activeOrganisation))) {
    navigation.push([
      { name: 'Organisation', type: 'heading' },
      { name: 'Settings', href: '/config', icon: CogIcon },
      { name: 'Projects', href: '/projects', icon: FolderIcon },
      { name: 'Users', href: '/users', icon: UserGroupIcon },
    ])
  }

  const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '/sign-out' },
  ]

  if (session?.activeOrganisation && session?.user?.organisations?.length > 1) {
    userNavigation.push({
      name: 'Change organisation',
      href: '/choose-organisation',
    })
  }

  const handleSidebarClose = useCallback(() => setSidebarOpen(false), [])
  const handleSidebarOpen = useCallback(() => setSidebarOpen(true), [])

  return (
    <div>
      <Sidebar onSidebarClose={handleSidebarClose} onSidebarOpen={handleSidebarOpen} sidebarOpen={sidebarOpen}>
        <SiteNav navItems={navigation} />
      </Sidebar>

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col">
        <div className="bg-primary-700 flex flex-grow flex-col overflow-y-auto border-r border-gray-200 px-2 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            {/* <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
              alt="Workflow"
            /> */}
          </div>

          <UserNav
            navItems={userNavigation}
            positionClasses="right-0 left-0"
            button={() => (
              <Menu.Button className="group w-full rounded-md bg-indigo-700 px-3.5 py-2 text-left text-sm font-medium text-indigo-100 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-gray-100">
                <span className="flex w-full items-center justify-between">
                  <span className="flex min-w-0 items-center justify-between space-x-3">
                    <img
                      className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-700"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">{session?.user?.name}</span>
                      <span className="truncate text-sm text-indigo-200">{session?.activeOrganisation?.name}</span>
                    </span>
                  </span>
                  <SelectorIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </span>
              </Menu.Button>
            )}
          />

          <div className="flex flex-grow flex-col">
            <SiteNav navItems={navigation} />
          </div>
        </div>
      </div>

      <div className="md:pl-72">
        <MobileTopNav userNavigation={userNavigation} onSidebarOpen={handleSidebarOpen} />
        <main className="mt-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
export default Layout
