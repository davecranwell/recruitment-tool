import React from 'react'
import type { Transition } from '@remix-run/react/transition'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { Form } from '@remix-run/react'
import classNames from 'classnames'

import { camelToSentence } from 'app/utils'
import Button from './Button'
import Alert from './Alert'

export type Option = {
  key: string
  value: any
  description?: string
}

export type FieldDef = {
  name: string
  type: string
  options?: Option[]
  hint?: string
  cols?: number
  colspan?: number
  content?: FieldDef[]
  label?: string
  required?: boolean
  size?: number
  defaultValue?: any
  placeholder?: string
  errors?: string[]
  valueTransform?: (value: any) => any
}

export type NestValidationError = {
  error: string
  message: NestTargetMessage[]
  statusCode: number
}

export type NestTargetMessage = {
  target: any
  property: string
  children: any[]
  constraints: object
}

/**
 * Takes an array of form fields, and an error structure from Nest, and returns
 * a new array of form fields with errors added to the corresponding fields.
 */
export const withActionErrors = (formFields: FieldDef[], errors?: NestTargetMessage[]) => {
  if (!errors?.length) return { fields: formFields, errors }

  const orphanedErrors = ([] as NestTargetMessage[]).concat(errors)

  const getTargetErrors = (fieldName: string): string[] => {
    const errorIdx = errors.findIndex((msg: NestTargetMessage) => msg.property === fieldName)
    const orphanedErrorsIdx = orphanedErrors.findIndex((msg: NestTargetMessage) => msg.property === fieldName)

    if (errorIdx === -1) return []

    orphanedErrors.splice(orphanedErrorsIdx, 1)
    const constraints = errors[errorIdx]?.constraints

    return constraints
      ? Object.values(constraints).map((msg) => msg.replace(new RegExp(fieldName), camelToSentence(fieldName)))
      : []
  }

  const enumerateFields = (fields: FieldDef[]): FieldDef[] => {
    return fields.map((field) => {
      if (field.content) {
        field.content = enumerateFields(field.content)
      }
      if (field.name) {
        field.errors = getTargetErrors(field.name)
      }
      return field
    })
  }

  return { fields: enumerateFields(formFields), orphanedErrors }
}

/**
 * Takes an array of form fields and an object defining their current values
 * and returns the field array with values inserted into the defaultValue properties
 */

export const withValues = (formFields: FieldDef[], values: any) => {
  const enumerateFields = (fields: FieldDef[]): FieldDef[] => {
    return fields.map((field) => {
      if (field.content) {
        field.content = enumerateFields(field.content)
      }
      if (field.name) {
        field.defaultValue = field.valueTransform ? field.valueTransform(values[field.name]) : values[field.name]
      }
      return field
    })
  }

  return enumerateFields(formFields)
}

type FieldProps = {
  field: FieldDef
}

const Field: React.FC<FieldProps> = ({ field }) => {
  return (
    <React.Fragment key={field.name}>
      {field.type !== 'hidden' && (
        <div
          className={classNames({
            'mt-6 grid grid-cols-4 gap-6': field.type === 'row',
            'col-span-4 sm:col-span-2': field.colspan === 4,
            'col-span-2 sm:col-span-1': field.colspan === 2,
          })}
        >
          {field.type === 'row' &&
            field.content &&
            field.content.map((field) => <Field key={field.name} field={field} />)}
          {field.type !== 'row' && (
            <>
              <label
                htmlFor={field.type !== 'radio' ? field.name : undefined}
                className={classNames('block font-medium text-gray-700', {
                  'text-base': field.type === 'radio',
                  'text-sm': field.type !== 'radio',
                })}
              >
                {field.label}
                {/* {field.required && <span className="text-red-600">(Required)</span>} */}
              </label>
              {field.type === 'radio' && field.hint && (
                <p className="text-sm leading-5 text-gray-500">How do you prefer to receive notifications?</p>
              )}
              <div className="relative mt-1">
                {['text', 'email', 'number', 'password', 'url', 'date', 'datetime-local'].includes(field.type) && (
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    className={classNames(
                      `focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm`,
                      {
                        'border-red-700': field.errors && field.errors.length,
                      }
                    )}
                    defaultValue={field.defaultValue}
                    aria-invalid={field.errors && field.errors.length ? 'true' : 'false'}
                    aria-describedby={
                      field.errors && field.errors.length ? `${field.name}-errors` : `${field.name}-description`
                    }
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={field.size}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'select' && (
                  <select
                    id={field.name}
                    name={field.name}
                    className="focus:ring-primary-500 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none sm:text-sm"
                    defaultValue={field.defaultValue}
                  >
                    {field.options &&
                      field.options
                        // if options are provided as an array of strings, use the string as the option value
                        .map((option) => (typeof option !== 'object' ? { key: option, value: option } : option))
                        .map((option) => {
                          return (
                            <option key={option.key} value={option.value}>
                              {option.key}
                            </option>
                          )
                        })}
                  </select>
                )}
                {field.type === 'radio' && (
                  <fieldset className="mt-4">
                    <div className="space-y-5">
                      {field?.options?.map((option) => {
                        return (
                          <div key={option.key} className="relative flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id={option.key}
                                aria-describedby="small-description"
                                name={field.name}
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={option.key} className="font-medium text-gray-700">
                                {option.key}
                              </label>
                              <p id="small-description" className="mt-2 text-gray-500">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </fieldset>
                )}
                {field.errors && field.errors.length > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {field.type !== 'radio' && field.hint && (
                <p className="mt-2 text-sm text-gray-500" id={`${field.name}-description`}>
                  {field.hint}
                </p>
              )}
              {field.errors && field.errors.length > 0 && (
                <div className="mt-1 text-sm text-red-600" id={`${field.name}-errors`}>
                  <div className="mt-2 text-sm text-red-600" id="email-error">
                    {Array.isArray(field.errors) ? field.errors.map((msg) => <div key={msg}>{msg}</div>) : field.errors}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {field.type === 'hidden' && <input type="hidden" value={field.defaultValue} name={field.name} id={field.name} />}
    </React.Fragment>
  )
}

type FormLayoutProps = {
  intro?: string
  fields: FieldDef[]
  submitText?: string
  errors?: NestValidationError
  transition: Transition
}

const FormLayout: React.FC<FormLayoutProps> = ({ fields, submitText = 'Submit', intro, errors, transition }) => {
  const processedFields = withActionErrors(fields, errors?.message)

  const { fields: fieldsWithValidation, orphanedErrors = [] } = processedFields

  return (
    <Form method="post">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          {intro && (
            <div>
              <p className="mt-1 text-sm text-gray-500">{intro}</p>
            </div>
          )}

          {orphanedErrors.length > 0 && (
            <Alert type="error" message={orphanedErrors.flatMap((error) => Object.values(error.constraints))} />
          )}

          {fieldsWithValidation.map((field) => (
            <Field key={field.name} field={field} />
          ))}
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <div className="flex justify-end">
            <Button type="submit" text={submitText} transition={transition} />
          </div>
        </div>
      </div>
    </Form>
  )
}

export default FormLayout
