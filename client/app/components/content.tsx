import { PlusIcon } from '@heroicons/react/solid'
import { Link } from '@remix-run/react'
import classNames from 'classnames'
import type { ReactChildren } from 'react'
import Button from './Button'

type Props = {
  children: React.ReactNode
  title?: string
  titleSize?: 'largest' | 'larger' | 'large'
  primaryAction?: {
    label: string
    link: string
  }
  secondaryAction?: {
    label: string
    link: string
  }
}

const Content: React.FC<Props> = ({ children, title, primaryAction, secondaryAction, titleSize = 'largest' }) => {
  return (
    <main className="flex-1">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2
            className={classNames('font-bold sm:truncate', {
              'text-2xl leading-7 sm:text-3xl': titleSize === 'largest',
              'text-lg leading-7 sm:text-2xl': titleSize === 'larger',
            })}
            id="content-title"
          >
            {title}
          </h2>
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
      </div>

      <div className="py-4">{children}</div>
    </main>
  )
}

export default Content
