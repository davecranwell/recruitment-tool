import React from 'react'
import { Transition } from '@remix-run/react/dist/transition'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { Form } from '@remix-run/react'
import classNames from 'classnames'

import { camelToSentence } from 'app/utils'
import Button from './Button'
import Alert from './Alert'
import Avatar from './Avatar'

export type Option = {
  key: string
  value: any
  description?: string
  [x: string]: any
}

export type FieldDef = {
  name: string
  key?: string
  enabled?: boolean
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
  disabled?: boolean
  props?: any
  text?: string
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
  if (!errors) return { fields: formFields }
  if (!errors?.length || !Array.isArray(errors)) return { fields: formFields, orphanedErrors: [errors] }

  // make a full copy of the original errors message array, so that as we take errors out of the original
  // array, we still have a list of them here.
  const orphanErrorCollector = ([] as NestTargetMessage[]).concat(errors)

  const getTargetErrors = (fieldName: string): string[] => {
    // find errors for this field by fieldName
    const errorIdx = errors.findIndex((msg: NestTargetMessage) => msg.property === fieldName)
    const orphanErrorCollectorIdx = orphanErrorCollector.findIndex(
      (msg: NestTargetMessage) => msg.property === fieldName
    )

    if (errorIdx === -1) return []

    // every time we match an error against a field, remove it from the orphanedcollector
    // so that only the errors that couldn't be matched - the orphans - remain at the end
    orphanErrorCollector.splice(orphanErrorCollectorIdx, 1)
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

  const fields = enumerateFields(formFields)

  const orphanedErrors = orphanErrorCollector.flatMap((error) => {
    if (typeof error === 'string') return error
    if (error?.constraints) return Object.values(error?.constraints)
  })

  return { fields, orphanedErrors }
}

/**
 * Takes an array of form fields and an object defining their current values
 * and returns the field array with values inserted into the defaultValue properties
 */

export const withValues = (formFields: FieldDef[], values: any) => {
  if (values.constructor.name !== 'Object')
    throw new Error(`withValues argument 'values' is not a plain javascript object`)

  const enumerateFields = (fields: FieldDef[]): FieldDef[] => {
    return fields.map((field) => {
      if (field.content) {
        field.content = enumerateFields(field.content)
      }
      if (field.name && values[field.name] !== undefined) {
        const val = Array.isArray(values[field.name]) ? values[field.name].shift() : values[field.name]

        field.defaultValue = field.valueTransform ? field.valueTransform(val) : val
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
  if (field.enabled === false) return null

  return (
    <React.Fragment key={field.key || field.name}>
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
            field.content.map((field) => <Field key={field.key || field.name} field={field} />)}
          {field.type !== 'row' && (
            <>
              {field.type !== 'title' && (
                <label
                  htmlFor={field.type !== 'radio' ? field.name : undefined}
                  className={classNames('block font-medium text-gray-700', {
                    'text-base': field.type === 'radio',
                    'text-sm': field.type !== 'radio',
                  })}
                >
                  {field.label}
                  {field.required && <span className="text-sm text-red-600">&nbsp; *</span>}
                </label>
              )}
              {field.type === 'radio' && field.hint && (
                <p className="text-sm leading-5 text-gray-500">How do you prefer to receive notifications?</p>
              )}
              <div className="relative mt-1">
                {['text', 'email', 'number', 'password', 'url', 'date', 'datetime-local'].includes(field.type) && (
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    disabled={field.disabled}
                    required={field.required}
                    className={classNames(
                      `focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 shadow-sm disabled:border-gray-200 disabled:text-slate-400 disabled:shadow-none sm:text-sm`,
                      {
                        'border-red-700': field.errors && field.errors.length,
                      }
                    )}
                    defaultValue={field.defaultValue}
                    aria-invalid={field.errors && field.errors.length ? 'true' : 'false'}
                    aria-describedby={
                      field.errors && field.errors.length ? `${field.name}-errors` : `${field.name}-description`
                    }
                    {...field.props}
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={field.size}
                    required={field.required}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border border-gray-300 shadow-sm disabled:border-gray-200 disabled:text-slate-400 disabled:shadow-none sm:text-sm"
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'textarealocalstorage' && (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={field.size}
                    required={field.required}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border border-gray-300 shadow-sm disabled:border-gray-200 disabled:text-slate-400 disabled:shadow-none sm:text-sm"
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'select' && (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none disabled:border-gray-200 disabled:text-slate-400 disabled:shadow-none sm:text-sm"
                    defaultValue={field.defaultValue}
                  >
                    {field.options &&
                      field.options
                        // if options are provided as an array of strings, use the string as the option value
                        .map((option) => (typeof option !== 'object' ? { key: option, value: option } : option))
                        .map((option, index) => {
                          return (
                            <option key={option.value} value={option.value}>
                              {option.key}
                            </option>
                          )
                        })}
                  </select>
                )}
                {field.type === 'usercheckbox' && (
                  <fieldset className="mt-4">
                    <div className="space-y-5">
                      {field?.options?.map((option) => {
                        return (
                          <div key={option.key} className="relative flex items-center">
                            <div className="flex h-5 items-center">
                              <input
                                id={option.key}
                                aria-describedby="small-description"
                                name={field.name}
                                type="checkbox"
                                value={option.value}
                                defaultChecked={field.defaultValue === option.value}
                                className="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={option.key} className="font-medium text-gray-700">
                                <Avatar name={option.key} size="s" imageUrl={option.avatarUrl} />
                                <span className="ml-2">{option.key}</span>
                              </label>
                              {option.descripion && (
                                <p id="small-description" className="mt-2 text-gray-500">
                                  {option.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </fieldset>
                )}
                {field.type === 'checkbox' && (
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
                                type="checkbox"
                                value={option.value}
                                defaultChecked={field.defaultValue === option.value}
                                className="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={option.key} className="font-medium text-gray-700">
                                {option.key}
                              </label>
                              {option.descripion && (
                                <p id="small-description" className="mt-2 text-gray-500">
                                  {option.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </fieldset>
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
                                value={option.value}
                                defaultChecked={field.defaultValue === option.value}
                                className="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={option.key} className="font-medium text-gray-700">
                                {option.key}
                              </label>
                              {option.descripion && (
                                <p id="small-description" className="mt-2 text-gray-500">
                                  {option.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </fieldset>
                )}
                {field.type === 'title' && (
                  <h2 className="text-lg font-medium leading-6 text-gray-900">{field.text}</h2>
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
  title?: string
  intro?: React.ReactNode | string
  fields: FieldDef[]
  submitText?: string
  submitWidth?: 'full' | 'auto' | 'half' | undefined
  errors?: NestValidationError
  transition: Transition
  wrapper?: 'auto' | 'none' | undefined
  [x: string]: any
}

const FormLayout: React.FC<FormLayoutProps> = ({
  fields,
  title,
  submitText = 'Submit',
  submitWidth,
  intro,
  errors,
  transition,
  wrapper = 'auto',
  ...props
}) => {
  const processedFields = withActionErrors(fields, errors?.message)

  const { fields: fieldsWithValidation, orphanedErrors = [] } = processedFields

  return (
    <Form method="post" {...props}>
      <div
        className={classNames({
          'bg-white shadow sm:overflow-hidden sm:rounded-lg': wrapper === 'auto',
        })}
      >
        <div className="divide-y divide-gray-200">
          {title && (
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            </div>
          )}

          <div
            className={classNames('space-y-6', {
              'bg-white py-6 px-4 sm:p-6': wrapper === 'auto',
            })}
          >
            {intro && (
              <div>
                <p className="mt-1 text-sm text-gray-500">{intro}</p>
              </div>
            )}

            {orphanedErrors.length > 0 && <Alert type="error" message={orphanedErrors} />}

            {fieldsWithValidation.map((field) => (
              <Field key={field.key || field.name} field={field} />
            ))}
          </div>
        </div>
        <div
          className={classNames({
            'bg-gray-50 px-4 py-3 text-right sm:px-6': wrapper === 'auto',
            'mt-8': wrapper !== 'auto',
          })}
        >
          <div className="flex justify-end">
            <Button type="submit" width={submitWidth} text={submitText} transition={transition} />
          </div>
        </div>
      </div>
    </Form>
  )
}

export default FormLayout
