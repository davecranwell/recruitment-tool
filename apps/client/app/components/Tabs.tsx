import { NavLink } from '@remix-run/react'
import classNames from 'classnames'
import Counter from './Counter'

type Props = {
  tabs: Tab[]
}

type Tab = {
  name: string
  href: string
  count?: string
}

const Tabs: React.FC<Props> = ({ tabs }) => {
  if (!tabs.length) return null

  return (
    <>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="focus:border-primary-500 focus:ring-primary-500 mt-4 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="mb-6 border-b border-gray-300">
          <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab: Tab) => (
              <NavLink
                end
                key={tab.name}
                to={tab.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'hover:border-primary-400 border-transparent text-gray-500 hover:text-gray-700',
                    'whitespace-nowrap border-b-4 py-4 px-6 font-medium'
                  )
                }
              >
                {tab.name}
                {tab.count ? (
                  <Counter className="ml-2" color="dark">
                    {tab.count}
                  </Counter>
                ) : null}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Tabs
