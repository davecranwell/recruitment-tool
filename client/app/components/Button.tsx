import type { Transition } from '@remix-run/react/transition'
import classNames from 'classnames'

type Props = {
  type?: 'submit' | 'reset' | 'button'
  transition?: Transition
  text: string
  textLoading?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  width?: 'auto' | 'full' | 'half'
  component?: React.ElementType
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
  ...props
}) => {
  const ButtonRoot: React.ElementType = component ?? 'button'

  return (
    <ButtonRoot
      type={type}
      className={classNames(
        `sflex justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`,
        {
          'bg-primary-600 hover:bg-primary-700 focus:ring-primary-600 border-transparent text-white':
            color === 'primary',
          'focus:ring-primary-500 border border-gray-300 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-offset-gray-100':
            color === 'secondary',
          'w-full': width === 'full',
          'w-1/2': width === 'half',
        }
      )}
      {...props}
    >
      {transition && transition.state === 'submitting' ? textLoading : text}
    </ButtonRoot>
  )
}

export default Button
