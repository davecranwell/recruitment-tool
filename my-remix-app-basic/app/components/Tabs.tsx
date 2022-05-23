import classNames from 'classnames'

type Props = {
  tabs: any[]
}

type Tab = {
  name: string
  href: string
  count: number
  current: boolean
}

// TODO migrate to compound component?
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
          className="focus:border-primary-500 focus:ring-primary-500 mt-4 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
          defaultValue={tabs && tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                )}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900',
                      'ml-2 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Tabs
