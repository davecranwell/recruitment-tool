import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import { useLoaderData, useParams, useSubmit } from '@remix-run/react'

import { api } from 'app/api.server'
import { notify, requireAuth } from '~/sessions.server'

import PersonHeader from '~/components/PersonHeader'

import ScoreAssessment from '~/components/ScoreAssessment'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const { id, interviewId } = params
  const { session } = await requireAuth(request)

  const body = await request.formData()

  const update = await api(data, `/position/${id}/interview/${interviewId}`, 'PATCH', await request.formData())

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

const ViewInterview = () => {
  const submitScore = useSubmit()
  const { id, applicantId, stageId } = useParams()
  const { applicantProfile, stage, scoringSystem, questionSet } = useLoaderData()

  const handleScore = (data: any) => {
    const formData = new FormData()
    formData.set('score', data)
    submitScore(formData, { method: 'post', replace: true })
  }

  // const errors = useActionData()
  //const transition = useTransition()

  return (
    <main className="py-10">
      <PersonHeader user={applicantProfile.user}></PersonHeader>

      <section aria-labelledby="notes-title">
        <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                Score this interview
              </h2>
            </div>
            <div className="px-4 py-6 sm:px-6">
              Using the scale Strong No Hire to Hire, indicate whether you'd choose to hire this candidate.
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:px-6">
            <ScoreAssessment value={20} onChoose={handleScore} {...scoringSystem} />
          </div>
        </div>
      </section>

      {/* <PersonHeader user={applicant.user} /> */}

      {/* <div className="mt-8">
        <Form submitText="Create interview" fields={fields} errors={errors} transition={transition} />
      </div> */}
    </main>
  )
}
export default ViewInterview
