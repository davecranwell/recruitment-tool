import { Link } from '@remix-run/react'
import React from 'react'

type Props = {
  items?: any[]
  fallback?: React.ElementType
  children: any
  className?: string
}

export const StackedList: React.FC<Props> = ({ items, fallback, children, className = '' }) => {
  const FallbackElement = fallback

  if (!items?.length && FallbackElement) return <FallbackElement />

  return (
    <div className={`overflow-hidden bg-white shadow sm:rounded-md ${className}`}>
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  )
}

type StackedListItemProps = {
  link: string
  children: any
}

export const StackedListItem: React.FC<StackedListItemProps> = ({ children, link }) => {
  return (
    <li>
      <Link to={link} className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">{children}</div>
      </Link>
    </li>
  )
}
