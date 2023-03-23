import classNames from 'classnames'

type Props = {
  status?: 'good' | 'bad'
  children: React.ReactNode
  [x: string]: any
}

const Pill: React.FC<Props> = ({ status, children, ...props }) => {
  const { className, ...propsRest } = props

  return (
    <span
      className={classNames(`${className} inline-block rounded-full px-2 text-xs font-semibold leading-5`, {
        'bg-emerald-100 text-emerald-800': status === 'good',
        'bg-red-100 text-red-800': status === 'bad',
      })}
      {...propsRest}
    >
      {children}
    </span>
  )
}

export default Pill
