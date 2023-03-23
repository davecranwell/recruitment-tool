import type { FieldDef, Option } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'

const formFields = (session: SessionData): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Pipeline Name',
    type: 'text',
    defaultValue: '',
  },
  { name: 'description', label: 'Description', type: 'textarea', size: 3 },
  { name: 'organisationId', type: 'hidden', defaultValue: session.activeOrganisation.id },
]

export default formFields
