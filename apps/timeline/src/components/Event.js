import { memo } from 'react'
import classNames from 'classnames'
import { DateTime } from 'luxon'

const Event = memo(function Event({ event }) {
  return (
    <>
      <div className={classNames('event-detail', `event-detail--${event.type}`)}>
        <div className="event-detail__inner">
          <div className="event-detail__name">
            {event.type === 'stage' && event.newStage}
            {event.type === 'comment' && '2 comments'}
          </div>
          <div className="event-detail__time">
            {event.type === 'stage' && new DateTime.fromMillis(event.startDateMillis).toFormat('h:mma')}
          </div>
        </div>
      </div>

      <div
        className="event-point"
        title={new DateTime.fromMillis(event.startDateMillis).toLocaleString(DateTime.DATETIME_MED)}
      ></div>
    </>
  )
})

export default Event
