import type { FieldDef } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'

export const newFormFields = (session: SessionData): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Organisation name',
    type: 'text',
    defaultValue: '',
    hint: `Your organisation name is your brand or company name. It can't be in use by another organisation on AppliCan`,
  },
  {
    name: 'file',
    required: true,
    label: 'Logo',
    type: 'file',
    defaultValue: '',
    hint: (
      <>
        Personalise AppliCan by uploading a logo with which your colleagues and applicants can identify your business.{' '}
        <br />
        Allowed files: png, jpg or jpeg of no more than 1MB in size
      </>
    ),
  },
]

export const editFormFields = (session: SessionData): FieldDef[] => [
  {
    name: 'name',
    label: 'Organisation name',
    type: 'text',
    defaultValue: '',
    hint: 'Your organisation name cannot be in use by another organisation',
  },
  {
    name: 'file',
    label: 'Logo',
    type: 'file',
    defaultValue: '',
    hint: 'Allowed files: png, jpg or jpeg of no more than 1MB in size',
  },
]
