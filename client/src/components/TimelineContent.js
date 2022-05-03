import { useRef } from 'react'
import { useBoundingclientrect } from 'rooks'
import classNames from 'classnames'

import Event from './Event'

export default function TimelineContent(props) {
  const contentRef = useRef()
  const sidebarSize = useBoundingclientrect(contentRef)

  const { events = {}, timeToPos, scrollPos, timelineWidth, timelineHeight, scaleFactor, onWheel } = props

  return (
    <div className="content-wrapper" onWheel={onWheel} style={{ transform: `translateX(-${scrollPos}px)` }}>
      <div
        className="eventgroup-list"
        ref={contentRef}
        style={{
          width: `${timelineWidth}px`,
          height: `${timelineHeight - sidebarSize?.top}px`,
        }}
      >
        <div
          className="eventgroup-list__backdrop"
          style={{
            transform: `translateX(${scrollPos}px)`,
          }}
        ></div>
        <EventGroup items={events.children} scrollPos={scrollPos} timeToPos={timeToPos} scaleFactor={scaleFactor} />
      </div>
    </div>
  )
}

function EventGroup({ depthIndex = 0, items, scrollPos, timeToPos, scaleFactor }) {
  return (items || []).map((item) => {
    return (
      <div
        className={`eventgroup eventgroup${depthIndex}`}
        key={`event-list-${item.name}`}
        data-key={`event-list-${item.name}`}
        data-depth={depthIndex}
      >
        <div
          className="group"
          style={{
            transform: `translateX(${scrollPos}px)`, //depthIndex === 0 &&
          }}
        >
          <h2 className="group__name">{item.name}</h2>
        </div>
        {item.children && (
          <EventGroup
            depthIndex={depthIndex + 1}
            items={item.children}
            name={item.name}
            scrollPos={scrollPos}
            timeToPos={timeToPos}
            scaleFactor={scaleFactor}
          />
        )}
        {item.events && <EventList group={item.name} events={item.events} timeToPos={timeToPos} />}
      </div>
    )
  })
}

function EventList({ group, events, timeToPos }) {
  const firstEvent = events[0]
  const lastEvent = events[events.length - 1]

  return (
    <div className="event-list">
      <div
        className="event-list__backdrop"
        style={{
          transform: `translateX(${timeToPos(firstEvent.startDateMillis)}px)`,
          width: `${timeToPos(lastEvent.startDateMillis) - timeToPos(firstEvent.startDateMillis)}px`,
        }}
      ></div>

      {(events || []).map((event, eventIndex) => (
        <div
          key={`event-${group}-${eventIndex}`}
          className={classNames('event-group', `event-group--${event.type}`)}
          style={{
            transform: `translateX(${timeToPos(event.startDateMillis)}px)`,
          }}
        >
          <Event event={event} />
        </div>
      ))}
    </div>
  )
}
