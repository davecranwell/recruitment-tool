import { memo } from 'react'

const Column = memo(function Column({ size, start, children, classes = '' }) {
  return (
    <div
      className={`grid-col ${classes}`}
      style={{
        width: `${size}px`,
        // using transformX instead of left uses GPU rendering, but all z-indexes are lost
        transform: `translateX(${start}px)`,
      }}
    >
      {children}
    </div>
  )
})

export default Column
