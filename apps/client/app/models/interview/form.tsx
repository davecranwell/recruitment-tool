import type { FieldDef } from 'app/components/Forms'
import type { SessionData } from 'app/sessions.server'
import type { Project } from 'app/models/projects/Project'

import { Stage } from '../positions/Stage'

const formFields = (
  session: SessionData,
  stage: Stage,
  positionId: number,
  applicantProfileId: number,
  interviewers: any
): FieldDef[] => [
  {
    name: 'title',
    type: 'title',
    text: `${stage.name} interview`,
  },
  {
    name: 'row2',
    type: 'row',
    content: [
      {
        name: 'startDateTime',
        colspan: 4,
        label: 'Start date & time',
        required: true,
        type: 'datetime-local',
      },
      {
        name: 'endDateTime',
        colspan: 4,
        label: 'End date & time',
        required: true,
        type: 'datetime-local',
      },
    ],
  },
  {
    name: 'attendees',
    type: 'usercheckbox',
    label: 'Attendees',
    options: interviewers.map((interviewer: any) => ({
      key: interviewer.user.name,
      value: interviewer.userId,
      avatarUrl: interviewer.user.avatarUrl,
    })),
  },

  { name: 'positionId', type: 'hidden', defaultValue: positionId },
  { name: 'stageId', type: 'hidden', defaultValue: stage.id },
  { name: 'applicantProfileId', type: 'hidden', defaultValue: applicantProfileId },
]

export default formFields
