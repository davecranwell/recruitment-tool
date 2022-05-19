import { Link } from '@remix-run/react'
import classNames from 'classnames'
import React from 'react'

type MessageBody = {
  title: string
  description?: string | string[]
}

type Props = {}

export const StackedList: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  )
}

type StackedListItemProps = {
  link: string
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
