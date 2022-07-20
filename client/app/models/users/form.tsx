import type { FieldDef } from 'app/components/Forms'

export const newUserFormFields = (): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Name',
    type: 'text',
  },
  {
    name: 'email',
    required: true,
    label: 'Email address',
    type: 'email',
  },
  {
    name: 'password',
    required: true,
    label: 'Password',
    type: 'password',
    hint: 'Password should be at least 12 characters long, containing lower and uppercase letters, as well as numbers',
  },
  {
    name: 'passwordConfirmation',
    required: true,
    label: 'Password confirmation',
    type: 'password',
  },
]

export const inviteUserformFields = (): FieldDef[] => [
  {
    name: 'email',
    required: true,
    label: 'Email address',
    type: 'email',
  },
  {
    name: 'role',
    required: true,
    label: 'Role',
    type: 'radio',
    options: [
      {
        key: 'Standard',
        value: 'STANDARD',
        description: "Can only access positions within projects to which they're invited.",
      },
      {
        key: 'Organisation admin',
        value: 'ORGANISATION_ADMIN',
        description: 'Can access all projects and positions and can invite users to the organisation, or remove them.',
      },
    ],
    defaultValue: 'STANDARD',
  },
]

export const editUserFormFields = (): FieldDef[] => [
  {
    name: 'role',
    required: true,
    label: 'Role',
    type: 'radio',
    options: [
      {
        key: 'Standard',
        value: 'STANDARD',
        description: "Can only access positions within projects to which they're invited.",
      },
      {
        key: 'Organisation admin',
        value: 'ORGANISATION_ADMIN',
        description: 'Can access all projects and positions and can invite users to the organisation, or remove them.',
      },
    ],
    defaultValue: 'STANDARD',
  },
]
