/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { ExclamationIcon, InformationCircleIcon, XCircleIcon, XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'

import type { AlertProps } from './Alert'

export type Notice = AlertProps & {
  ttl?: number
}

type Props = {
  messages: Notice
}

const Notifications: React.FC<Props> = ({ messages }) => {
  const [show, setShow] = useState(true)
  const [messageState, setMessageState] = useState(messages)

  const { type, message, ttl } = messageState || {}

  useEffect(() => {
    setShow(true)
    setMessageState(messages)
  }, [messages])

  useEffect(() => {
    // prevent a timeout if there is no message,
    // or there is a message but a ttl of 0
    if (!messages || !ttl) return

    const timeout = setTimeout(() => {
      setShow(false)
    }, ttl)

    return () => window.clearTimeout(timeout)
  }, [messages, ttl])

  if (!messageState) return null

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2 md:-translate-y-2"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {type === 'error' && <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />}
                    {type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />}
                    {type === 'info' && <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />}
                    {type === 'warning' && <ExclamationIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <h3
                      className={classNames('font-medium', {
                        'text-green-800': type === 'success',
                        'text-blue-800': type === 'info',
                        'text-orange-800': type === 'warning',
                        'text-red-800': type === 'error',
                      })}
                    >
                      {!Array.isArray(message) && typeof message !== 'string'
                        ? message.title
                        : Array.isArray(message)
                        ? message.map((msg) => <div key={msg}>{msg}</div>)
                        : message}
                    </h3>
                    {!Array.isArray(message) && typeof message !== 'string' && message.description && (
                      <div
                        className={classNames('mt-2 text-sm', {
                          'text-green-700': type === 'success',
                          'text-blue-700': type === 'info',
                          'text-orange-700': type === 'warning',
                          'text-red-700': type === 'error',
                        })}
                      >
                        {Array.isArray(message.description)
                          ? message.description.map((desc) => <div key={desc}>{desc}</div>)
                          : message.description}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false)
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

export default Notifications
