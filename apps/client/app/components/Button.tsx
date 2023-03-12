import type { Transition } from '@remix-run/react/dist/transition'
import classNames from 'classnames'

type Props = {
  type?: 'submit' | 'reset' | 'button'
  transition?: Transition
  text?: string
  textLoading?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  width?: 'auto' | 'full' | 'half'
  component?: React.ElementType
  icon?: any
  [x: string]: any
}

const Button: React.FC<Props> = ({
  type,
  transition,
  text,
  textLoading = 'Loading...',
  color = 'primary',
  width = 'auto',
  component,
  icon,
  ...props
}) => {
  const ButtonRoot: React.ElementType = component ?? 'button'

  const Icon = icon

  return (
    <ButtonRoot
      type={type}
      className={classNames(
        `flex items-center justify-center rounded-md border py-2 px-4 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap`,
        {
          'bg-primary-600 hover:bg-primary-700 focus:ring-primary-600 border-transparent text-white':
            color === 'primary',
          'bg-red-600 hover:bg-red-700 focus:ring-red-600 border-transparent text-white': color === 'danger',
          'focus:ring-primary-500 border border-gray-300 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-offset-gray-100':
            color === 'secondary',
          'bg-green-600 hover:bg-green-700 focus:ring-primary-600 border-transparent text-white': color === 'success',
          'w-full': width === 'full',
          'w-1/2': width === 'half',
        }
      )}
      {...props}
    >
      {icon && <Icon className="h-5 w-5 mr-2.5" aria-hidden="true" />}
      {transition && transition.state === 'submitting' ? textLoading : text}
    </ButtonRoot>
  )
}

export default Button
