import * as React from 'react'
import { Fragment, useState } from 'react'
import classNames from 'classnames'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Link, NavLink } from '@remix-run/react'

type Props = {
  navItems: any[]
}

const SiteNav: React.FC<Props> = ({ navItems }) => {
  return (
    <nav className="flex-1 space-y-8 divide-y divide-gray-200 px-2 pb-4">
      {navItems.map((group, index) => (
        <div key={`group${index}`} className="pt-8">
          {group.map((item) => (
            <Fragment key={item.name}>
              {item.type === 'heading' && (
                <h3
                  className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400"
                  id="projects-headline"
                >
                  {item.name}
                </h3>
              )}
              {item.href && (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      'text-primary-600 group flex items-center rounded-md py-2 px-2 text-sm font-medium ring-offset-0',
                      {
                        'bg-primary-50': isActive,
                        'hover:bg-primary-50': !isActive,
                      }
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={classNames('mr-3 h-6 w-6 flex-shrink-0', {
                          'text-gray-400': isActive,
                          'text-gray-300': !isActive,
                        })}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              )}
            </Fragment>
          ))}
        </div>
      ))}
    </nav>
  )
}

export default SiteNav
