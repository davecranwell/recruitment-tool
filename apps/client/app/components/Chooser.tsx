import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import classNames from 'classnames'

type Props = {
  items: Array<any>
  label?: string
  className: string
  value?: any
  onChange?: Function
}

const Chooser: React.FC<Props> = ({ value, className, label, items, onChange = () => {} }) => {
  const [selected, setSelected] = useState(value || items[0])

  return (
    <Listbox
      value={selected}
      onChange={(value) => {
        setSelected(value)
        onChange(value)
      }}
    >
      {({ open }) => (
        <div className={className}>
          {/* {label && <Listbox.Label className="block text-sm font-bold text-gray-700">{label}</Listbox.Label>} */}
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm">
              <span className="flex items-center">
                <span className="block truncate">
                  {label && <span className="text-sm font-bold text-gray-700">{label}:</span>} {selected.key}
                </span>
                <span className={'ml-auto inline-block py-0.5 px-3 text-xs rounded-full bg-gray-50'}>
                  {selected.count}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {items.map((item, index) => (
                  <Listbox.Option
                    key={`${item.key}${index}`}
                    className={({ active }) =>
                      classNames('relative cursor-default select-none py-2 pl-3 pr-9', {
                        'text-white bg-primary-600': active,
                        'text-gray-900': !active,
                      })
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className="flex items-center">
                          <span
                            className={classNames('block truncate', {
                              'font-semibold': selected,
                              'font-normal': !selected,
                            })}
                          >
                            {item.key}
                          </span>
                          <span
                            className={classNames(
                              'ml-auto mr-2 group inline-block py-0.5 px-3 text-xs rounded-full bg-gray-50',
                              {
                                'text-gray-900': !active,
                                'text-primary-600 group-hover': active,
                              }
                            )}
                          >
                            {item.count}
                          </span>
                        </span>

                        {selected ? (
                          <span
                            className={classNames('absolute inset-y-0 right-0 flex items-center pr-4', {
                              'text-white': active,
                              'text-primary-600': !active,
                            })}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  )
}

export default Chooser
