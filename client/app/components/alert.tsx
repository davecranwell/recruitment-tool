import { XCircleIcon, ExclamationIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'

import classNames from 'classnames'

export type AlertMessageBody = {
  title: string
  description?: string | string[]
}

export type AlertProps = {
  message: string | string[] | AlertMessageBody
  type: 'success' | 'info' | 'warning' | 'error'
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div
      className={classNames('rounded-md p-4', {
        'bg-green-50': type === 'success',
        'bg-blue-50': type === 'info',
        'bg-orange-50': type === 'warning',
        'bg-red-50': type === 'error',
      })}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'error' && <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />}
          {type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />}
          {type === 'info' && <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />}
          {type === 'warning' && <ExclamationIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />}
        </div>
        <div className="ml-3">
          <h3
            className={classNames('text-sm font-medium', {
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
      </div>
    </div>
  )
}

export default Alert
