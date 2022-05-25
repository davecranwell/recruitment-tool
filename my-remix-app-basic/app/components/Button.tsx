import type { Transition } from '@remix-run/react/transition'
import classNames from 'classnames'
import type { MouseEventHandler } from 'react'

type Props = {
  type?: 'submit' | 'reset' | 'button'
  transition?: Transition
  text: string
  textLoading?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  width?: 'auto' | 'full' | 'half'
  onClick?: MouseEventHandler
  component?: React.ElementType
  to?: string
}

// a react comp[] that can be a link or a button

const Button: React.FC<Props> = ({
  children,
  type,
  transition,
  text,
  textLoading = 'Loading...',
  color = 'primary',
  width = 'auto',
  onClick = () => {},
  component,
  to,
}) => {
  const ButtonRoot: React.ElementType = component ?? 'button'

  return (
    <ButtonRoot
      type={type}
      className={classNames(
        `sflex justify-center rounded-md border  py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`,
        {
          'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 border-transparent text-white':
            color === 'primary',
          'focus:ring-primary-500 border border-gray-300 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-offset-gray-100':
            color === 'secondary',
          'w-full': width === 'full',
          'w-1/2': width === 'half',
        }
      )}
      onClick={onClick}
      to={to}
    >
      {transition && transition.state !== 'idle' ? textLoading : text}
    </ButtonRoot>
  )
}

export default Button
