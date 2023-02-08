import React from 'react'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import { Link } from '@remix-run/react'
import type { Matches } from 'remix-utils'

type Props = {
  matches: Matches
}

const Breadcrumb: React.FC<Props> = ({ matches }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {matches
          // don't display the current route (assumed to be the latest)
          //.splice(-1, 1)
          // skip routes that don't have a breadcrumb
          .filter((match) => match.handle && match.handle.breadcrumb)
          // render breadcrumbs!
          .map((match, index) => (
            <li key={match.id}>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <span className="ml-4 font-medium text-gray-500 hover:text-gray-700">
                  {match.handle?.breadcrumb(match)}
                </span>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
