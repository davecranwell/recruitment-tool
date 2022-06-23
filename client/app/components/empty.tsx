/* This example requires Tailwind CSS v2.0+ */

import { PlusIcon } from '@heroicons/react/solid'
import { Link } from '@remix-run/react'

import { titleCase } from 'app/utils'
import React from 'react'

// TODO make icon prop lower case and handle it bette
type Props = {
  Icon: React.ElementType
  title: string
  intro?: string
  createLink?: string | null
  createText?: string
}

const Empty: React.FC<Props> = ({ Icon, title, createLink, createText, intro }) => {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />

      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {intro && <p className="mt-1 text-sm text-gray-500">{intro}.</p>}
      {createLink && (
        <div className="mt-6">
          <Link
            to={createLink}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
