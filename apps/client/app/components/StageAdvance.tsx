import { Fragment, useState, useCallback } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid'
import classNames from 'classnames'

import type { Stage } from '~/models/positions/Stage'

type Props = {
  stages: Stage[]
  currentStageIndex: number
  onChange?: Function
}

const StageAdvance: React.FC<Props> = ({ stages, currentStageIndex, onChange = () => {} }) => {
  const [selected, setSelected] = useState(stages[currentStageIndex].id)

  const handleChange = useCallback(
    (value) => {
      setSelected(value)
      onChange(value)
    },
    [onChange]
  )

  const currentStage = stages.filter((stageInPipeline: Stage) => stageInPipeline.id === selected).pop()

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change published status</Listbox.Label>
          <div className="relative">
            <div className="inline-flex divide-x rounded-md shadow-sm">
              <div className="divide-primary-500 relative z-0 inline-flex divide-x rounded-md shadow-sm">
                <div className="bg-primary-600 relative inline-flex items-center rounded-l-md border border-transparent py-2 pl-3 pr-4 text-white shadow-sm">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />

                  {currentStage && <p className="ml-2.5 font-medium">{currentStage.name}</p>}
                </div>
                <Listbox.Button className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-600 relative inline-flex items-center rounded-l-none rounded-r-md p-2 font-medium text-white focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50">
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {stages
                  //.filter((stageInPipeline) => stageInPipeline.stageId !== selected.stageId)
                  .map((stage) => (
                    <Listbox.Option
                      key={stage.id}
                      className={({ active }) =>
                        classNames('relative cursor-default select-none p-4', {
                          'bg-primary-500 text-white': active,
                          'text-gray-900': !active,
                        })
                      }
                      value={stage.id}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p className={selected ? 'font-semibold' : 'font-normal'} data-test={selected}>
                              {stage.name}
                            </p>
                            {selected ? (
                              <span className={active ? 'text-white' : 'text-primary-500'}>
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </div>
                          {/* <p className={classNames('mt-2', { 'text-primary-200': active, 'text-gray-500': !active })}>
                          {stage.description}
                        </p> */}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default StageAdvance
