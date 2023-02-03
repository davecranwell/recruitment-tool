import { PlusIcon } from '@heroicons/react/solid'
import { Link, useMatches } from '@remix-run/react'
import classNames from 'classnames'
import type { ReactChildren } from 'react'
import Button from './Button'

type Props = {
  children?: React.ReactNode
  title?: string
  titleLink?: string
  titleSize?: 'largest' | 'larger' | 'large'
  primaryAction?:
    | false
    | {
        label: string
        link: string
      }
  secondaryAction?: {
    label: string
    link: string
  }
}

const ContentBanner: React.FC<Props> = ({
  children,
  title,
  titleLink,
  primaryAction,
  secondaryAction,
  titleSize = 'largest',
}) => {
  const matches = useMatches()

  const hideBannerAction = matches.some((match) => match?.handle?.hideBannerAction || false)

  return (
    <div className="flex-1 bg-neutral-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 ">
        {children && <div className="pb-4">{children}</div>}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2
              className={classNames('font-bold sm:truncate', {
                'text-2xl leading-7 sm:text-3xl': titleSize === 'largest',
                'text-lg leading-7 sm:text-2xl': titleSize === 'larger',
              })}
              id="content-title"
            >
              {titleLink ? <Link to={titleLink}>{title}</Link> : title}
            </h2>
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="mt-4 flex space-x-4 md:mt-0 md:ml-4">
              {secondaryAction && (
                <Button component={Link} color="secondary" to={secondaryAction.link} text={secondaryAction.label} />
              )}

              {!hideBannerAction && primaryAction && (
                <>
                  <Button component={Link} to={primaryAction.link} text={primaryAction.label} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentBanner
