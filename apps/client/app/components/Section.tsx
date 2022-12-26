import React, { useId } from 'react'

type Props = {
  children: React.ReactNode
  footer?: React.ReactNode
  title?: string
}

const Section: React.FC<Props> = ({ title, children, footer }) => {
  const id = useId()

  return (
    <section aria-labelledby={id}>
      <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {title && (
            <div className="px-4 py-5 sm:px-6">
              <h2 id={id} className="text-lg font-medium text-gray-900">
                {title}
              </h2>
            </div>
          )}
          <div className="px-4 py-6 sm:px-6">{children}</div>
        </div>
        {footer && <div className="bg-gray-50 px-4 py-6 sm:px-6">{footer}</div>}
      </div>
    </section>
  )
}

export default Section
