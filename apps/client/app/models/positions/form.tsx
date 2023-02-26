import type { FieldDef } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'
import type { Project } from 'app/models/projects/Project'

const formFields = (session: SessionData, projects: Project[]): FieldDef[] => [
  {
    name: 'projectId',
    required: true,
    label: 'Project',
    type: 'select',
    options: projects.map((project) => ({
      key: project.name,
      value: project.id,
    })),
    defaultValue: '',
  },
  {
    name: 'row1',
    type: 'row',
    content: [
      {
        name: 'name',
        colspan: 4,
        required: true,
        label: 'Position Name',
        type: 'text',
        defaultValue: '',
      },
      {
        name: 'type',
        colspan: 2,
        required: true,
        label: 'Employment type',
        type: 'select',
        options: [
          {
            key: 'Full time',
            value: 'FULLTIME',
          },
          {
            key: 'Part time',
            value: 'PARTTIME',
          },
          {
            key: 'Contract',
            value: 'CONTRACT',
          },
        ],
      },
    ],
  },
  {
    name: 'row2',
    type: 'row',
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
    name: 'row3',
    type: 'row',
    content: [
      {
        name: 'openingDate',
        colspan: 4,
        label: 'Opening date',
        required: true,
        type: 'date',
        valueTransform: (value) => value?.split('T')[0],
      },
      {
        name: 'closingDate',
        colspan: 4,
        label: 'Closing date',
        required: true,
        type: 'date',
        valueTransform: (value) => value?.split('T')[0],
      },
    ],
  },
  { name: 'description', label: 'Description', type: 'textarea', size: 3 },
  { name: 'organisationId', type: 'hidden', defaultValue: session.activeOrganisation.id },
  { name: 'pipelineId', type: 'hidden', defaultValue: 2 },
]

export default formFields
