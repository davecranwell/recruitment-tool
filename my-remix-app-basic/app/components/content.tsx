import { PlusIcon } from '@heroicons/react/solid'
import { Link } from '@remix-run/react'
import type { ReactChildren } from 'react'
import Button from './Button'

type Props = {
  children: React.ReactNode
  title?: string
  primaryAction?: {
    label: string
    link: string
  }
  secondaryAction?: {
    label: string
    link: string
  }
}

const Content: React.FC<Props> = ({ children, title, primaryAction, secondaryAction }) => {
  return (
    <main className="flex-1">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">{title}</h2>
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="mt-4 flex space-x-4 md:mt-0 md:ml-4">
            {secondaryAction && (
              <Button component={Link} color="secondary" to={secondaryAction.link} text={secondaryAction.label} />
            )}
            {primaryAction && (
              <>
                <Button component={Link} to={primaryAction.link} text={primaryAction.label} />
              </>
            )}
          </div>
        )}

        {/* <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create
          </button>
        </div> */}
      </div>

      <div className="py-4">{children}</div>
    </main>
  )
}

export default Content
