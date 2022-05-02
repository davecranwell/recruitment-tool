import { forwardRef } from 'react'
import classNames from 'classnames'

import Column from './Column'
import ColumnDate from './ColumnDate'

import { isWeekendDay, isToday, isFirstOfMonth } from '../utils'

const VirtualisedTimeline = forwardRef((props, ref) => {
  const { totalSize, items, onWheel, onScroll } = props

  return (
    <div className={`virtualised-wrapper`} ref={ref} onWheel={onWheel} onScroll={onScroll}>
      <div className="virtualised" style={{ width: `${totalSize}px` }}>
        <div className="dates-virtualised">
          {items.map(({ index, size, start, startMillis }) => {
            return (
              <Column key={index} size={size} start={start}>
                <ColumnDate idx={index} dateMillis={startMillis} />
              </Column>
            )
          })}
        </div>

        <div className="backgrounds-virtalised">
          {items.map(({ index, size, start, startMillis }) => {
            return (
              <Column
                classes={classNames({
                  'grid-col--weekend': isWeekendDay(startMillis),
                  'grid-col--today': isToday(startMillis),
                  'grid-col--firstofmonth': isFirstOfMonth(startMillis),
                })}
                key={index}
                size={size}
                start={start}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default VirtualisedTimeline
