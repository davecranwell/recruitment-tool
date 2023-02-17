/* This example requires Tailwind CSS v2.0+ */

import { PlusIcon } from '@heroicons/react/solid'
import { Link } from '@remix-run/react'

import React from 'react'

type Props = {
  icon: React.ElementType
  title: string
  intro?: string
  createLink?: string | null
  createText?: string
}

const Empty: React.FC<Props> = ({ icon, title, createLink, createText, intro }) => {
  const Icon = icon

  return (
    <div className="text-center mx-auto max-w-lg">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />

      <h3 className="py-4 text-lg font-medium text-gray-500">{title}</h3>
      {intro && <p className="mt-1 text-sm text-gray-500">{intro}.</p>}
      {createLink && (
        <div className="mt-6">
          <Link
            to={createLink}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {createText || 'Create one now'}
          </Link>
        </div>
      )}
    </div>
  )
}

export default Empty
