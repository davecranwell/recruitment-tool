import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useParams, useTransition } from '@remix-run/react'

import { api } from 'app/api.server'
import { requireAuth } from '~/sessions.server'

import type { StageInPipeline } from 'app/models/positions/Stage'
import Form from '~/components/Forms'
import PersonHeader from '~/components/PersonHeader'

import formFields from 'app/models/interview/form'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const { id, applicantId } = params
  const body = await request.formData()

  const result = await api(data, '/interview', 'POST', body)

  if (result.ok) return redirect(`/positions/${id}/applicant/${applicantId}`)

  return result
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { id, applicantId, stageId } = params
  if (!id || !stageId) return null

  const { sessionData } = await requireAuth(request)
  const applicantForPositionReq = await api(data, `/position/${id}/applicant/${applicantId}`)
  const positionReq = await api(data, `/position/${id}?includePipeline=true&includeUserRoles=true`)

  const position = await positionReq.json()
  const applicant = await applicantForPositionReq.json()

  const thisStage = position.pipeline.stages.find(
    (stageItem: StageInPipeline) => stageItem.stageId === parseInt(stageId, 10)
  )

  // get list of interviews here
  const interviewers = position.project.userRoles

  return json({
    fields: formFields(
      sessionData,
      thisStage.stage,
      parseInt(id, 10),
      parseInt(applicant.applicantProfile.id, 10),
      interviewers
    ),
    applicant: applicant.applicantProfile,
    stage: thisStage.stage,
    interviewers,
  })
}

export const meta: MetaFunction = ({ data }) => {
  const { stage, applicant } = data
  return { title: `Create a ${stage.name} interview for ${applicant.user.name}` }
}

const CreateInterview = () => {
  const { id, applicantId, stageId } = useParams()
  const { fields, applicant, stage } = useLoaderData()
  const errors = useActionData()
  const transition = useTransition()

  return (
    <main className="py-10">
      <PersonHeader user={applicant.user} />

      <div className="mt-8">
        <Form submitText="Create interview" fields={fields} errors={errors} transition={transition} />
      </div>
    </main>
  )
}
export default CreateInterview
