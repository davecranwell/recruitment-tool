import type { FieldDef } from 'app/components/Forms'

export const loginFields = (redirectTo?: string, token?: string): FieldDef[] => [
  {
    name: 'email',
    required: true,
    label: 'Email address',
    type: 'email',
    props: {
      autoComplete: 'email',
    },
  },
  {
    name: 'password',
    required: true,
    label: 'Password',
    type: 'password',
    props: {
      autoComplete: 'current-password',
    },
  },
  {
    name: 'redirect-to',
    type: 'hidden',
    defaultValue: redirectTo,
  },
  {
    name: 'token',
    type: 'hidden',
    defaultValue: token,
  },
]

export const loginToAcceptInvitationFields = (redirectTo?: string, token?: string): FieldDef[] => [
  {
    name: 'email',
    required: true,
    label: 'Email address',
    type: 'email',
    disabled: true,
  },
  {
    name: 'password',
    required: true,
    label: 'Password',
    type: 'password',
    props: {
      autoComplete: 'current-password',
    },
  },
  {
    name: 'redirect-to',
    type: 'hidden',
    defaultValue: redirectTo,
  },
  {
    name: 'token',
    type: 'hidden',
    defaultValue: token,
  },
]

export const newUserFormFields = (): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Your name',
    type: 'text',
  },
  {
    name: 'email',
    required: true,
    label: 'Your email address',
    type: 'email',
    disabled: true,
  },
  {
    name: 'password',
    required: true,
    label: 'Choose a password',
    type: 'password',
    hint: 'Password should be at least 12 characters long, containing lower and uppercase letters, as well as numbers',
    props: {
      pattern: '[A-Za-z0-9]{12,}',
    },
  },
  {
    name: 'passwordConfirmation',
    required: true,
    label: 'Enter the password again to confirm',
    type: 'password',
    hint: 'This must be the same password you chose above',
  },
  {
    name: 'token',
    type: 'hidden',
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
        key: 'Organisation owner',
        value: 'ORGANISATION_OWNER',
        description: 'Can access all projects and positions and can invite users to the organisation, or remove them.',
      },
    ],
    defaultValue: 'STANDARD',
  },
  {
    name: 'organisationId',
    type: 'hidden',
  },
]

export const editUserFormFields = (): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Name',
    type: 'text',
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
        key: 'Organisation owner',
        value: 'ORGANISATION_OWNER',
        description: 'Can access all projects and positions and can invite users to the organisation, or remove them.',
      },
    ],
    defaultValue: 'STANDARD',
  },
]
