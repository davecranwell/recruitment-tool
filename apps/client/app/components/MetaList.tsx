type MetaListProps = {
  className?: string
  children: any
}

type ItemProps = {
  icon: React.ElementType
  children?: any
  [x: string]: any
}

export const MetaListItem: React.FC<ItemProps> = ({ icon, children, ...props }) => {
  const Icon = icon

  if (!children) return null

  return (
    <div className="mt-2 flex items-center text-sm text-gray-500" {...props}>
      <Icon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
      {children}
    </div>
  )
}

export const MetaList: React.FC<MetaListProps> = ({ children, className }) => {
  return (
    <div className={`mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8 ${className}`}>{children}</div>
  )
}
