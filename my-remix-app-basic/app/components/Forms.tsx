import React from 'react'
import { Form } from '@remix-run/react'
import classNames from 'classnames'

import { camelToSentence, titleCase } from 'app/utils'
import Alert from 'app/components/Alert'
import type { Transition } from '@remix-run/react/transition'
import { ExclamationCircleIcon } from '@heroicons/react/solid'

export type FieldDef = {
  name: string
  type: string
  options?: any[]
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

export const withActionErrors = (formFields: FieldDef[], errors?: NestTargetMessage[]) => {
  if (!errors?.length) return formFields

  const getTargetErrors = (fieldName: string): string[] => {
    const constraints = errors.filter((msg: NestTargetMessage) => msg.property === fieldName)[0]?.constraints
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

  return enumerateFields(formFields) //formFields.map((field: FieldDef) => ({ ...field, errors: getTargetErrors(field.name) }))
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
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
                {/* {field.required && <span className="text-red-600">(Required)</span>} */}
              </label>
              <div className="relative mt-1">
                {['text', 'email', 'number', 'password', 'url', 'date'].includes(field.type) && (
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
                        .map((option) => (typeof option !== 'object' ? { key: option, value: option } : option))
                        .map((option) => {
                          return (
                            <option key={option} value={option.value}>
                              {option.key}
                            </option>
                          )
                        })}
                  </select>
                )}
                {field.errors && field.errors.length > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {field.hint && (
                <p className="mt-2 text-sm text-gray-500" id={`${field.name}-description`}>
                  {field.hint}
                </p>
              )}
              {field.errors && field.errors.length > 0 && (
                <div className="mt-1 text-sm text-red-600" id={`${field.name}-errors`}>
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {Array.isArray(field.errors) ? field.errors.map((msg) => <div key={msg}>{msg}</div>) : field.errors}
                  </p>
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
  const fieldsWithValidation = withActionErrors(fields, errors?.message)

  console.log(fieldsWithValidation)

  return (
    <Form method="post">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          {intro && (
            <div>
              <p className="mt-1 text-sm text-gray-500">{intro}</p>
            </div>
          )}

          {fieldsWithValidation.map((field) => (
            <Field key={field.name} field={field} />
          ))}
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {transition.state !== 'idle' ? 'One second...' : submitText}
            </button>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default FormLayout
