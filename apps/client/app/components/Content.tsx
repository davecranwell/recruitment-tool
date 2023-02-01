import { Link } from '@remix-run/react'
import classNames from 'classnames'
import Button from './Button'

type Props = {
  children: React.ReactNode
  title?: string
  titleLink?: string
  titleSize?: 'largest' | 'larger' | 'large'
  primaryAction?: {
    label: string
    link: string
  }
  secondaryAction?: {
    label: string
    link: string
  }
  padX?: boolean
  as?: keyof JSX.IntrinsicElements
}

const Content: React.FC<Props> = ({
  children,
  title,
  titleLink,
  primaryAction,
  secondaryAction,
  titleSize = 'largest',
  padX = true,
  as = 'main',
}) => {
  const Component = as

  return (
    <Component className={classNames('mx-auto max-w-6xl flex-1 py-4 space-y-4', { 'px-4 sm:px-6 lg:px-8': padX })}>
      {(title || primaryAction || secondaryAction) && (
        <div className="md:flex md:items-center md:justify-between">
          {title && (
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
          )}

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
      )}

      <div>{children}</div>
    </Component>
  )
}

export default Content
