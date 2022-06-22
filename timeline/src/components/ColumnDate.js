import { memo } from 'react'
import { DateTime } from 'luxon'

function TimeColumnDate({ dateMillis, idx }) {
  const thisDay = new DateTime.fromMillis(dateMillis).toUTC().startOf('day')

  return (
    <div className="date" title={dateMillis} data-test={idx}>
      <div className="date--month">
        {thisDay.day === 1 && thisDay.toFormat('MMM')}
        {thisDay.day === 1 && thisDay.month === 1 && ` ${thisDay.toFormat('yy')}`}
      </div>
      <div className="date__daywrapper">
        <div className="date--dayofweek">{thisDay.toFormat('ccc')}</div>
        <div className="date--day">{thisDay.toFormat('dd')}</div>
      </div>
    </div>
  )
}

export default memo(TimeColumnDate)
