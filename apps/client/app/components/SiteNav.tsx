import { NavLink } from '@remix-run/react'
import classNames from 'classnames'
import * as React from 'react'
import { Fragment } from 'react'

type Props = {
  navItems: any[]
}

const SiteNav: React.FC<Props> = ({ navItems }) => {
  return (
    <nav className="divide-primary-400 flex-1 space-y-8 divide-y px-2 pb-4">
      {navItems.map((group, index) => (
        <div key={`group${index}`} className="pt-8">
          {group.map((item) => (
            <Fragment key={item.name}>
              {item.type === 'heading' && (
                <h3
                  className="text-primary-200 px-3 pb-2 text-xs font-semibold uppercase tracking-widest tracking-wider"
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
                      'text-primary-50 group flex items-center rounded-md py-2 px-2 text-sm font-medium ring-offset-0',
                      {
                        'bg-primary-700 text-primary-100': isActive,
                        'hover:bg-primary-700': !isActive,
                      }
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={classNames('mr-3 h-6 w-6 flex-shrink-0', {
                          'text-primary-100': isActive,
                          'text-primary-200': !isActive,
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
