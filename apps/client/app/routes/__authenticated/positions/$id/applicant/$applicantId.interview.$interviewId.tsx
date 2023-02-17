import { ActionFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { useLoaderData, useParams, useSubmit, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { notify, requireAuth } from '~/sessions.server'

import Form, { withValues } from 'app/components/Forms'
import PersonHeader from '~/components/PersonHeader'
import ScoreAssessment from '~/components/ScoreAssessment'
import Section from '~/components/Section'

export const action: ActionFunction = async (data) => {
  const { request } = data
  const { session } = await requireAuth(request)

  // merge the notes into a json.stringified value
  const formData = await request.formData()
  if (formData.getAll('notes').length) {
    formData.set('notes', JSON.stringify(formData.getAll('notes')))
  }

  const update = await api(data, `/assessment`, 'POST', formData)

  const headers = update.ok
    ? await notify(session).success('Applicant interview assessment updated')
    : await notify(session).error('An error occured')

  return json({}, { headers })
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { id, interviewId } = params
  if (!id || !interviewId) return null

  await requireAuth(request)
  return api(data, `/position/${id}/interview/${interviewId}`)
}

export const meta: MetaFunction = ({ data }) => {
  const { applicantProfile, stage } = data
  return { title: `${stage.name} interview for ${applicantProfile.user.name}` }
}

type Question = {
  text: string
}

const ViewInterview = () => {
  // TODO:This ought to be a fetcher
  const submitScore = useSubmit()
  const transition = useTransition()
  const { id, applicantId, interviewId } = useParams()
  const { applicantProfile, scoringSystem, questions, stage, assessments } = useLoaderData()

  const handleScore = (data: any) => {
    const formData = new FormData()

    if (!applicantId || !id || !interviewId) return

    formData.set('score', data)
    formData.set('applicantProfileId', applicantId)
    formData.set('positionId', id)
    formData.set('interviewId', interviewId)

    submitScore(formData, { method: 'post', replace: true })
  }

  const { score, notes } = assessments[0] || {}

  return (
    <main className="py-10">
      <PersonHeader user={applicantProfile.user} />

      <div className="grid grid-cols-1 gap-6 mt-8">
        {questions && (
          <>
            <Form
              submitText="Save notes"
              title={`${stage.name} Questions & Notes`}
              fields={withValues(
                [
                  ...questions?.questions?.map((q: Question, i: number) => ({
                    name: 'notes',
                    group: 'notes',
                    key: `notes_${i}`,
                    label: q.text,
                    type: 'textarealocalstorage',
                  })),
                  { name: 'positionId', type: 'hidden', defaultValue: id },
                  { name: 'applicantProfileId', type: 'hidden', defaultValue: applicantId },
                  { name: 'interviewId', type: 'hidden', defaultValue: interviewId },
                ],
                {
                  ...assessments[0],
                  notes,
                }
              )}
              transition={transition}
            />
          </>
        )}

        <Section
          title="Score this interview"
          footer={<ScoreAssessment value={score} onChoose={handleScore} {...scoringSystem} />}
        >
          Using the scale Strong No Hire to Hire, indicate whether you'd choose to hire this candidate.
        </Section>
      </div>

      {/* <PersonHeader user={applicant.user} /> */}

      {/* <div className="mt-8">
        <Form submitText="Create interview" fields={fields} errors={errors} transition={transition} />
      </div> */}
    </main>
  )
}
export default ViewInterview
