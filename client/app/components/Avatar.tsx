import classNames from 'classnames'

type Props = {
  name: string
  size: 'xs' | 's' | 'm' | 'lg' | 'xl'
}

const Avatar: React.FC<Props> = ({ name, size }) => {
  const initials = name.replace(/(\w).*\b(\w).*\b/, '$1$2').toUpperCase()

  return (
    <span
      className={classNames('inline-flex items-center justify-center rounded-full bg-gray-300', {
        'h-6 w-6': size === 'xs',
        'h-8 w-8': size === 's',
        'h-10 w-10': size === 'm',
        'h-12 w-12': size === 'lg',
        'h-14 w-14': size === 'xl',
      })}
    >
      <span
        className={classNames('text-g font-medium leading-none text-gray-500', {
          'text-xs': size === 'xs',
          'text-sm': size === 's',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
        })}
      >
        {initials}
      </span>
    </span>
  )
}

export default Avatar
