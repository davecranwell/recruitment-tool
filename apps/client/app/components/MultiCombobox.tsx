import { Combobox } from '@headlessui/react'
import { ChevronDownIcon, XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'

import type { FieldDef, Option } from './Forms'

type Props = {
  field: FieldDef
  optionName?: string
  optionRenderer?: Function
}

const MultiComboBox: React.FC<Props> = ({ field, optionName = 'item', optionRenderer }) => {
  const [selected, setSelected] = useState<Option[]>(field.defaultValue)
  const [query, setQuery] = useState('')

  useEffect(() => {
    field?.props?.onChange && field.props.onChange(selected)
  }, [selected])

  const handleChange = (option: Option[]) => {
    setSelected(option)
    setQuery('')
  }

  const handleRemove = (option: Option) => {
    setSelected((selected) => selected.filter((selectedItem) => selectedItem.value !== option.value))
  }

  // Filter the items by the active query
  const filteredItems =
    query === ''
      ? field.options
      : field?.options?.filter((item) => item.key.toLowerCase().includes(query.toLowerCase()))

  // Then we want to remove the items we've already selected
  const unSelectedItems =
    filteredItems?.filter((item) => !selected.find((selected) => item.value === selected?.value)) || []

  return (
    <>
      <Combobox value={selected} onChange={handleChange} multiple>
        <div className="relative">
          <div
            className={classNames(
              'form-select flex flex-wrap relative focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none disabled:border-gray-200 disabled:text-slate-400 shadow-sm disabled:shadow-none sm:text-sm',
              {
                'border-red-700': field.errors && field.errors.length,
              }
            )}
            aria-invalid={field.errors && field.errors.length ? 'true' : 'false'}
            aria-describedby={
              field.errors && field.errors.length ? `${field.name}-errors` : `${field.name}-description`
            }
          >
            {selected.length > 0 && (
              <ul className="flex flex-wrap">
                {selected.map((option: Option, index) => (
                  <li
                    key={option?.value}
                    className="flex items-center items-stretch rounded bg-primary-10 p-1 mb-1 whitespace-nowrap mr-3"
                  >
                    <span className="mr-1">
                      {optionRenderer && optionRenderer(option)}
                      {!optionRenderer && option?.key}
                    </span>

                    <span
                      title={`Remove this ${optionName}}`}
                      onClick={() => handleRemove(option)}
                      className="group cursor-pointer flex items-center"
                    >
                      <XIcon
                        className="m-1 h-3 w-3 text-primary-600 group-hover:text-red-600"
                        aria-label={`Remove this ${optionName}`}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Combobox.Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-none p-0 text-sm leading-5 text-gray-900 focus:ring-0"
            />
            <Combobox.Button className="absolute w-8 inset-y-0 right-0 flex items-center"></Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {unSelectedItems.length > 0 &&
              unSelectedItems
                .map((option) => (typeof option !== 'object' ? { key: option, value: option } : option))
                .map((option, index) => (
                  <Combobox.Option key={option.key} value={option} as={Fragment}>
                    {({ active, selected }) => (
                      <li
                        className={`flex items-center cursor-default select-none py-2 px-4 ${
                          active ? 'bg-primary-500 text-white' : 'bg-white text-black'
                        }`}
                      >
                        {optionRenderer && optionRenderer(option)}
                        {!optionRenderer && option.key}
                      </li>
                    )}
                  </Combobox.Option>
                ))}

            {(!unSelectedItems || !unSelectedItems.length) && (
              <li className={`flex items-center cursor-default text-gray-400 select-none py-2 px-4`}>
                There are no {query.length > 0 && 'matching'} {optionName}s available to choose
              </li>
            )}
          </Combobox.Options>
        </div>
      </Combobox>
      {selected
        .map((option) => option.value)
        .map((option, index) => (
          <input key={`${field.key || field.name}${index}`} type="hidden" value={option} name={field.name} />
        ))}
    </>
  )
}

export default MultiComboBox
