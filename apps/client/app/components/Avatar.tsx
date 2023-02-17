import classNames from 'classnames'

type Props = {
  name: string
  size: 'xs' | 's' | 'm' | 'lg' | 'xl'
  imageUrl?: string
}

const Avatar: React.FC<Props> = ({ name = '', size, imageUrl }) => {
  const initials = name
    .replace(/(\w).*\b(\w).*\b/, '$1$2')
    .toUpperCase()
    .substring(0, 3)

  const dimensionClasses = classNames({
    'h-6 w-6': size === 'xs',
    'h-8 w-8': size === 's',
    'h-10 w-10': size === 'm',
    'h-12 w-12': size === 'lg',
    'h-14 w-14': size === 'xl',
  })

  return (
    <span
      className={classNames(
        'border-white border border-solid inline-flex items-center justify-center rounded-full bg-gray-300',
        dimensionClasses
      )}
    >
      <span
        className={classNames('text-g font-medium leading-none text-gray-500', {
          'text-[0.55rem]': size === 'xs',
          'text-sm': size === 's',
          'text-lg': size === 'lg',
          'text-xl': size === 'xl',
        })}
      >
        {imageUrl ? (
          <img referrerPolicy="no-referrer" className={`inline-block rounded-full`} src={imageUrl} alt="" />
        ) : (
          initials
        )}
      </span>
    </span>
  )
}

export default Avatar
