import { useRef, useCallback, useState, useMemo, useEffect, memo } from 'react'
import { useVirtual } from 'react-virtual'

import { useElementHeight, useTimeFunctions, useIsKeyActive, clamp } from '../utils'

import Content from './TimelineContent'
import VirtualisedTimeline from './VirtualisedTimeline'

function Timeline({ startDay, minZoom = 1, maxZoom = 10, events, daysShown = 365, zoomFactor = 0.5, defaultZoom = 1 }) {
  const timelineWrapperRef = useRef()
  const timelineHeight = useElementHeight(timelineWrapperRef)
  const isControlPressed = useIsKeyActive('Control')

  const [zoomAndIndex, setZoomAndIndex] = useState({
    zoom: defaultZoom,
    index: undefined,
  })

  const [timeWindow, setTimeWindow] = useState(daysShown)

  const minGridSize = 60
  const timeWindowIncrement = 100
  const scaleFactor = zoomAndIndex.zoom * minGridSize

  const { totalSize, virtualItems, scrollToIndex } = useVirtual({
    horizontal: true,
    size: timeWindow,
    parentRef: timelineWrapperRef,
    estimateSize: useCallback(() => scaleFactor, [scaleFactor]),
    overscan: 5,
  })

  const { timeToIndex, indexToTime, timeToPos } = useTimeFunctions(startDay, timeWindow, totalSize)

  useEffect(() => {
    scrollToIndex(Math.ceil(timeToIndex(startDay)), { align: 'center' })
  }, [startDay, scrollToIndex, timeToIndex])

  useEffect(() => {
    const { index } = zoomAndIndex
    if (!index) return
    scrollToIndex(index, { align: 'center' })
  }, [zoomAndIndex, scrollToIndex])

  const handleScroll = (e) => {
    if (e.target.scrollLeft / totalSize > 0.8) {
      // add to the end
      setTimeWindow(timeWindow + timeWindowIncrement)
    }
    if (e.target.scrollLeft / totalSize < 0.2) {
      // remove from the en
      setTimeWindow(Math.max(timeWindow - timeWindowIncrement, daysShown))
    }
  }

  const handleMouseWheel = (e) => {
    if (!isControlPressed) return
    const delta = Math.floor(e.deltaY) > 0 ? zoomFactor : -zoomFactor
    const newZoom = clamp(zoomAndIndex.zoom + delta, minZoom, maxZoom)

    if (newZoom === zoomAndIndex.zoom || !virtualItems.length) return

    // find middle index
    const middle = virtualItems[Math.floor(virtualItems.length / 2)].index

    setZoomAndIndex({
      zoom: newZoom,
      index: middle,
    })
  }

  // map virtualItems so they have start/end dates in millis
  const timestampedVirtualitems = useMemo(() => {
    return virtualItems.map((item) => {
      if (item.startMillis) return item

      item.startMillis = Math.floor(indexToTime(item.index))
      return item
    })
  }, [virtualItems, indexToTime])

  return (
    <>
      <Content
        onWheel={handleMouseWheel}
        events={events}
        timeToPos={timeToPos}
        scaleFactor={scaleFactor}
        timelineWidth={totalSize}
        timelineHeight={timelineHeight}
        scrollPos={timelineWrapperRef.current?.scrollLeft}
      />

      <VirtualisedTimeline
        onScroll={handleScroll}
        onWheel={handleMouseWheel}
        ref={timelineWrapperRef}
        totalSize={totalSize}
        items={timestampedVirtualitems}
      />
    </>
  )
}

export default memo(Timeline)
