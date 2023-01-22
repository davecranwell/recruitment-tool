import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, useParams, useSubmit, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { notify, requireAuth } from '~/sessions.server'

import Form, { withValues } from 'app/components/Forms'
import PersonHeader from '~/components/PersonHeader'
import ScoreAssessment from '~/components/ScoreAssessment'
import Section from '~/components/Section'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const { id, interviewId } = params
  const { session } = await requireAuth(request)

  const update = await api(data, `/assessment`, 'POST', await request.formData())

  const headers = update.ok
    ? await notify(session).success('Applicant interview assessment updated')
    : await notify(session).error('An error occured')

  return json({}, { headers })
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { id, interviewId } = params
  if (!id || !interviewId) return null

  const { sessionData } = await requireAuth(request)
  return api(data, `/position/${id}/interview/${interviewId}`)
}

// export const meta: MetaFunction = ({ data }) => {
//   const { stage, applicant } = data
//   return { title: `Create a ${stage.name} interview for ${applicant.user.name}` }
// }

type Question = {
  text: string
}

const ViewInterview = () => {
  // TODO:This ought to be a fetcher
  const submitScore = useSubmit()
  const transition = useTransition()
  const { id, applicantId, interviewId } = useParams()
  const { applicantProfile, scoringSystem, questions, assessments } = useLoaderData()

  const handleScore = (data: any) => {
    const formData = new FormData()

    if (!applicantId || !id || !interviewId) return

    formData.set('score', data)
    formData.set('applicantProfileId', applicantId)
    formData.set('positionId', id)
    formData.set('interviewId', interviewId)

    submitScore(formData, { method: 'post', replace: true })
  }

  return (
    <main className="py-10">
      <PersonHeader user={applicantProfile.user}></PersonHeader>
      <div className="grid grid-cols-1 gap-6 mt-8">
        {questions && (
          <>
            <Form
              submitText="Save notes"
              title="Questions"
              fields={questions?.questions?.map((q, i) => ({
                name: `Question ${i}`,
                label: q.text,
                type: 'textarea',
              }))}
              transition={transition}
            />
            {/* <Section title="Questions">
              {questions?.questions?.map((qs: Question, i: number) => (
                <div key={`question-${i}`}>
                  {qs.text}
                  <textarea className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border border-gray-300 shadow-sm disabled:border-gray-200 disabled:text-slate-400 disabled:shadow-none sm:text-sm"></textarea>
                </div>
              ))}
            </Section> */}
          </>
        )}

        <Section
          title="Score this interview"
          footer={<ScoreAssessment value={assessments[0]?.score} onChoose={handleScore} {...scoringSystem} />}
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
