import type { Transition } from '@remix-run/react/dist/transition'
import classNames from 'classnames'

type Props = {
  children?: any
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
  children,
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
        `shadow-sm cursor-pointer flex items-center justify-center rounded-lg border py-2 px-6 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap`,
        {
          'bg-primary hover:bg-primary-700 focus:ring-primary border-transparent text-white': color === 'primary',
          'bg-red-600 hover:bg-red-700 focus:ring-red-600 border-transparent text-white': color === 'danger',
          'focus:ring-neutral-400 border border-neutral-300 bg-white text-neutral-700 hover:bg-gray-50 focus:ring-offset-neutral-100':
            color === 'secondary',
          'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 border-transparent text-white':
            color === 'success',
          'w-full': width === 'full',
          'w-1/2': width === 'half',
        }
      )}
      {...props}
    >
      {icon && <Icon className="h-5 w-5 mr-2.5" aria-hidden="true" />}
      {transition && transition.state === 'submitting' ? textLoading : text}
      {children}
    </ButtonRoot>
  )
}

export default Button
