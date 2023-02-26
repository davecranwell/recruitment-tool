import type { FieldDef, Option } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'
import Avatar from '~/components/Avatar'
import type { User } from '../users/User'

const optionRenderer = (option: Option) => (
  <span className="flex items-center">
    <Avatar name={option.key} size="xs" imageUrl={option.avatarUrl} />
    <span className="ml-3">{option.key}</span>
  </span>
)

const formFields = (
  session: SessionData,
  onManagerChange: Function,
  onInterviewerChange: Function,
  onFinancialManagerChange: Function,
  managerUsers: Option[],
  interviewUsers: Option[],
  financialUsers: Option[]
): FieldDef[] => [
  {
    name: 'name',
    required: true,
    label: 'Project Name',
    type: 'text',
    defaultValue: '',
  },
  { name: 'description', label: 'Description', type: 'textarea', size: 3 },
  {
    name: 'rolestitle',
    label: 'Roles',
    type: 'title',
  },
  {
    name: 'row1',
    type: 'row',
    cols: 4,
    content: [
      {
        name: 'hiringManagers',
        colspan: 4,
        label: 'Hiring managers',
        type: 'multicombobox',
        hint: 'Hiring managers can manage applicants for the role, including changing their stage or disqualifying them. They can also see more sensitive information about the roles and applicants.',
        options: managerUsers,
        optionLabel: 'user',
        optionRenderer,
        props: {
          onChange: onManagerChange,
        },
      },
      {
        name: 'interviewers',
        colspan: 4,
        label: 'Interviewers',
        type: 'multicombobox',
        hint: 'Interviewers may only take part in interviews and provide feedback. They have no control over the hiring process.',
        options: interviewUsers,
        optionLabel: 'user',
        optionRenderer,
        props: {
          onChange: onInterviewerChange,
        },
      },
    ],
  },
  {
    name: 'approvaltitle',
    label: 'Financial approval',
    hint: (
      <>
        You may optionally define financial budget holders who must approval the creation of new positions.{' '}
        <strong>Choosing financial managers will automatically cause new positions to require approval.</strong>
      </>
    ),
    type: 'title',
  },
  {
    name: 'row2',
    type: 'row',
    cols: 4,
    content: [
      {
        name: 'financialManagers',
        colspan: 4,
        label: 'Financial managers',
        type: 'multicombobox',
        options: financialUsers,
        optionLabel: 'user',
        optionRenderer,
        props: {
          onChange: onFinancialManagerChange,
        },
      },
      {
        name: 'approvalsNeeded',
        colspan: 4,
        label: 'Required number of approvals',
        hint: 'If financial managers are selected and this is left blank, this defaults to 1 approval',
        type: 'number',
        defaultValue: '',
      },
    ],
  },
  { name: 'organisationId', type: 'hidden', defaultValue: session.activeOrganisation.id },
]

export default formFields
