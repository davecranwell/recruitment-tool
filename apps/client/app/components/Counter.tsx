import classNames from 'classnames'

type Props = {
  color?: 'dark'
  children: React.ReactNode
  [x: string]: any
}

const Counter: React.FC<Props> = ({ color, children, ...props }) => {
  const { className, ...propsRest } = props

  return (
    <span
      className={classNames(
        `ml-auto inline-block py-0.5 px-3 text-xs rounded-full text-gray-500 bg-gray-50 ${className}`,
        {
          'bg-gray-200': color === 'dark',
        }
      )}
      {...propsRest}
    >
      {children}
    </span>
  )
}

export default Counter
