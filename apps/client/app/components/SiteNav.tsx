import { NavLink } from '@remix-run/react'
import classNames from 'classnames'
import * as React from 'react'
import { Fragment } from 'react'

type Props = {
  navItems: any[]
}

const SiteNav: React.FC<Props> = ({ navItems }) => {
  return (
    <nav className="divide-neutral-100 flex-1 space-y-8 divide-y px-2 pb-4">
      {navItems.map((group, index) => (
        <div key={`group${index}`} className="pt-8">
          {group.map((item: any) => (
            <Fragment key={item.name}>
              {item.type === 'heading' && (
                <h3
                  className="text-neutral-400 px-3 pb-2 text-xs font-semibold uppercase tracking-widest"
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
                      'text-neutral-400 group flex items-center rounded-md py-2 px-2 font-semibold ring-offset-0',
                      {
                        'bg-primary text-neutral-100': isActive,
                        'hover:bg-primary-10 hover:text-neutral-600': !isActive,
                      }
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={classNames('mr-3 h-6 w-6 flex-shrink-0', {
                          'text-white': isActive,
                          'text-neutral-400 group-hover:text-neutral-600': !isActive,
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
