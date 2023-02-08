import { useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useDebounce } from '~/hooks/useDebounce'
import type { FieldDef } from './Forms'

type Props = {
  field: FieldDef
  keyName: any
}

function useLocalStorage(key: string) {
  const [state, setState] = useState<string>()

  useEffect(() => {
    const localVal = localStorage.getItem(key)
    if (localVal) setState(localVal)
  }, [key])

  return [state]
}

const TextareaLocalStorage: React.FC<Props> = ({ keyName, field }) => {
  const href = useLocation()
  const localKey = `${href.pathname}`
  const [localStorageState] = useLocalStorage(localKey)
  const [value, setValue] = useState<string>()
  const [debouncedQuery, isDebouncing] = useDebounce(value, 1000)

  // Once only on load, set the field value from the default, if provided.
  // Since field.defaultValue will never change, this should only ever fire once
  // Since we're using a controlled field, the first data for the value state has to come from somewhere
  useEffect(() => {
    setValue(field.defaultValue || '')
  }, [])

  // Set the first value from whatever local storage finds.
  // This will always fill the field if local storage has something.
  useEffect(() => {
    const localStorageVal = localStorageState ? JSON.parse(localStorageState) : null
    if (localStorageVal) setValue(localStorageVal[keyName])
  }, [localStorageState, keyName])

  // Updates local storage whenever the value is updated and a 1s pause occurs,
  useEffect(() => {
    if (debouncedQuery && !isDebouncing && value !== field.defaultValue) {
      const currentLocalStringified = localStorage.getItem(localKey)
      const currentLocalValue = currentLocalStringified ? JSON.parse(currentLocalStringified) : {}
      localStorage.setItem(localKey, JSON.stringify({ ...currentLocalValue, [keyName]: value }))
    }
  }, [debouncedQuery, isDebouncing, keyName, localKey, value, field.defaultValue])

  return (
    <textarea
      id={field.name}
      name={field.name}
      rows={field.size}
      required={field.required}
      className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border border-gray-300 shadow-sm disabled:border-gray-200 disabled:text-slate-400 disabled:shadow-none sm:text-sm"
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  )
}

export default TextareaLocalStorage
