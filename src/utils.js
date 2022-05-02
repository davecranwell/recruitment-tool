import { useMemo, useState, useEffect } from 'react'

import { useOnWindowResize } from 'rooks'

import { DateTime, Duration } from 'luxon'

import { MILLIS_IN_DAY, MILLIS_IN_MINUTE } from './constants'

export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max)
}

export const makeScale = (fromRange, toRange) => {
  const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0])
  return (from) => (from - fromRange[0]) * d + toRange[0]
}

export const localisedTimestampAsPercentOfDay = (timestamp) => {
  const date = new Date(timestamp)
  const offset = date.getTimezoneOffset()

  return (((timestamp - offset * MILLIS_IN_MINUTE) % MILLIS_IN_DAY) / MILLIS_IN_DAY) * 100
}

export const isWeekendDay = (timestamp) => {
  const d = new Date(timestamp)
  return d.getDay() === 0 || d.getDay() === 6
}

export const isToday = (timestamp) => {
  const startOfToday = DateTime.utc().startOf('day')
  const endOfToday = DateTime.utc().endOf('day')
  return timestamp >= startOfToday && timestamp <= endOfToday
}

export const isFirstOfMonth = (timestamp) => new DateTime.fromMillis(timestamp).day === 1

export const bucketMap = (events, bucket) => {
  const buckets = {}

  if (!events?.length) return buckets

  events.forEach((event) => {
    const bucketName = event[bucket] || 0

    !buckets[bucketName] && (buckets[bucketName] = [])
    buckets[bucketName].push(event)
  })

  return buckets
}

export function useGetComputedStyle(element, property) {
  return useMemo(() => element && getComputedStyle(element).getPropertyValue(property), [element])
}

export function useElementHeight(ref) {
  const [size, setSize] = useState()

  useEffect(() => setSize(ref.current?.clientHeight), [ref])

  useOnWindowResize(() => setSize(ref.current?.clientHeight))

  return size
}

export const addDayMillis = (events) =>
  events.map((event) => {
    event.left = localisedTimestampAsPercentOfDay(event.startDateMillis)
    return event
  })

export const useTimeFunctions = (startDay, daysShown, totalSize) =>
  useMemo(() => {
    const posDomain = [0, totalSize]
    const indexDomain = [0, daysShown]
    console.log(daysShown, indexDomain)
    const timeDomain = [
      startDay
        .toUTC()
        .minus(new Duration.fromObject({ days: daysShown / 2 }))
        .startOf('day')
        .toMillis(),
      startDay
        .toUTC()
        .plus(new Duration.fromObject({ days: daysShown / 2 }))
        .startOf('day')
        .toMillis(),
    ]

    const timeToIndex = makeScale(timeDomain, indexDomain)
    const indexToTime = makeScale(indexDomain, timeDomain)
    const timeToPos = makeScale(timeDomain, posDomain)

    return { timeToIndex, indexToTime, timeToPos }
  }, [startDay, daysShown, totalSize])

export const useIsKeyActive = (key) => {
  const [keyActive, setKeyActive] = useState()

  useEffect(() => {
    const downHandler = (e) => {
      e.key === key && setKeyActive(true)
    }
    const upHandler = (e) => {
      e.key === key && setKeyActive(false)
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  return keyActive
}
