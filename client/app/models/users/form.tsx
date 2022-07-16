import type { FieldDef } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'
import type { Project } from 'app/models/projects/Project'

const formFields = (session: SessionData): FieldDef[] => [
  {
    name: 'role',
    required: true,
    label: 'Role',
    type: 'radio',
    options: [
      {
        key: 'Standard',
        value: 'STANDARD',
        description: "Can only access the positions within projects they're invited to.",
      },
      {
        key: 'Organisation admin',
        value: 'ORGANISATION_ADMIN',
        description: 'Can access all projects and positions and can invite users to the organisation, or remove them.',
      },
    ],
    defaultValue: '',
  },
]

export default formFields
