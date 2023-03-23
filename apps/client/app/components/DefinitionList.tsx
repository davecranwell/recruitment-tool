import type { ReactElement } from 'react'

type DefinitionListItemProps = {
  className?: string
  label: string | ReactElement
  children: any
}

type DefinitionListProps = {
  children?: any
  [x: string]: any
}

export const DefinitionList: React.FC<DefinitionListProps> = ({ children, ...props }) => {
  if (!children) return null

  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2" {...props}>
      {children}
    </dl>
  )
}

export const DefinitionListItem: React.FC<DefinitionListItemProps> = ({ label, children, className }) => {
  return (
    <div className={`sm:col-span-1 ${className}`}>
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  )
}
