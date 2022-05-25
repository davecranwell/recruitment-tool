type MetaListProps = {
  className?: string
}

type ItemProps = {
  value: string
  icon: React.ElementType
}

export const MetaListItem: React.FC<ItemProps> = ({ value, icon }) => {
  const Icon = icon

  if (!value) return null

  return (
    <div className="mt-2 flex items-center text-sm text-gray-500">
      <Icon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
      {value}
    </div>
  )
}

export const MetaList: React.FC<MetaListProps> = ({ children, className }) => {
  return (
    <div className={`mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-8 ${className}`}>{children}</div>
  )
}
