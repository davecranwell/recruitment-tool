import type { ReactChildren } from 'react'

type Props = { children: React.ReactNode; title?: string }

const Content: React.FC<Props> = ({ children, title }) => {
  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="px-4 sm:px-6 md:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
        <div className="px-4 sm:px-6 md:px-0">
          <div className="py-4">{children}</div>
        </div>
      </div>
    </main>
  )
}

export default Content
