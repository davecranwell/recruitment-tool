import type { FieldDef, Option } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'
import Avatar from '~/components/Avatar'
import type { User } from '../users/User'

const formFields = (
  session: SessionData,
  onManagerChange: Function,
  onInterviewerChange: Function,
  managerUsers: Option[],
  interviewUsers: Option[]
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
        optionRenderer: (option: Option) => (
          <span className="flex items-center">
            <Avatar name={option.key} size="xs" imageUrl={option.avatarUrl} />
            <span className="ml-3">{option.key}</span>
          </span>
        ),
        props: {
          onChange: onManagerChange,
        },
      },
      {
        name: 'interviewers',
        colspan: 4,
        label: 'Interviewers',
        type: 'multicombobox',
        hint: 'Interviewers may only take part in interviews and provide feedback. They have no control over the hiring process beyond this.',
        options: interviewUsers,
        optionLabel: 'user',
        optionRenderer: (option: Option) => (
          <span className="flex items-center">
            <Avatar name={option.key} size="xs" imageUrl={option.avatarUrl} />
            <span className="ml-3">{option.key}</span>
          </span>
        ),
        props: {
          onChange: onInterviewerChange,
        },
      },
    ],
  },
  { name: 'organisationId', type: 'hidden', defaultValue: session.activeOrganisation.id },
]

export default formFields
