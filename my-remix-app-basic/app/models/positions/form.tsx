import type { FieldDef } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'

const formFields = (session: SessionData): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Position Name',
    type: 'text',
    defaultValue: '',
  },
  {
    name: 'row1',
    type: 'row',
    cols: 4,
    content: [
      {
        name: 'location',
        colspan: 4,
        label: 'Location',
        type: 'text',
        hint: 'e.g Remote / Remote (UK) / Office',
      },
      {
        name: 'salaryRange',
        colspan: 4,
        label: 'Salary range',
        type: 'text',
        hint: 'e.g $50,000 / $50k - $70k + Stock etc',
      },
    ],
  },
  {
    name: 'row2',
    type: 'row',
    cols: 4,
    content: [
      {
        name: 'openingDate',
        colspan: 4,
        label: 'Opening date',
        type: 'date',
        valueTransform: (value) => value.split('T')[0],
      },
      {
        name: 'closingDate',
        colspan: 4,
        label: 'Closing date',
        type: 'date',
        valueTransform: (value) => value.split('T')[0],
      },
    ],
  },
  { name: 'description', label: 'Description', type: 'textarea', size: 3 },
  { name: 'organisationId', type: 'hidden', defaultValue: session.activeOrganisation.id },
]

export default formFields
