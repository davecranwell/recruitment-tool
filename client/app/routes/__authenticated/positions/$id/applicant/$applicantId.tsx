import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useLoaderData, useOutletContext, useSubmit, useTransition } from '@remix-run/react'

import { api } from '~/api.server'
import { notify, requireAuth } from '~/sessions.server'

import type { StageInPipeline } from 'app/models/positions/Stage'

import StageAdvance from '~/components/StageAdvance'

export const action: ActionFunction = async (data) => {
  const { request, params } = data
  const { id, applicantId } = params
  const { session } = await requireAuth(request)

  const update = await api(data, `/position/${id}/applicant/${applicantId}`, 'PATCH', await request.formData())

  const headers = update.ok
    ? await notify(session).success('Applicant stage changed')
    : await notify(session).error('An error occured')

  return json({}, { headers })
}

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  const { id, applicantId } = params
  await requireAuth(request)

  return await api(data, `/position/${id}/applicant/${applicantId}`)
}

export const meta: MetaFunction = ({ data }) => {
  const { applicantProfile } = data
  const { user } = applicantProfile
  return { title: `Applicant - ${user?.name}` }
}

const Profile = () => {
  const advanceStage = useSubmit()
  const { stages } = useOutletContext() as any
  const profile = useLoaderData()
  const actionData = useActionData()

  const { applicantProfile, stage } = profile
  const { user } = applicantProfile

  const stageIndex = stages.findIndex((stageItem: StageInPipeline) => stageItem.stageId === stage.id)

  const handleAdvanceStage = (data: any) => {
    const formData = new FormData()
    formData.set('stage', data)
    advanceStage(formData, { method: 'post', replace: true })
  }

  return (
    <main className="py-10">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full"
                src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                alt=""
              />
              <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            {/* <p className="text-sm font-medium text-gray-500">
                Applied for{' '}
                <a href="#" className="text-gray-900">
                  Front End Developer
                </a>{' '}
                on <time dateTime="2020-08-25">August 25, 2020</time>
              </p> */}
          </div>
        </div>

        <StageAdvance stages={stages} currentStageIndex={stageIndex} onChange={handleAdvanceStage} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          {/* Description list*/}
          <section aria-labelledby="applicant-information-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 id="applicant-information-title" className="text-lg font-medium leading-6 text-gray-900">
                  Applicant Information
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  {/* <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Application for</dt>
                      <dd className="mt-1 text-sm text-gray-900">Backend Developer</dd>
                    </div> */}
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Salary expectation</dt>
                    <dd className="mt-1 text-sm text-gray-900">{applicantProfile.askingSalary}</dd>
                  </div>
                  {/* <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">+1 555-555-5555</dd>
                    </div> */}
                  {/* <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">About</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat.
                        Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                        proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
                      </dd>
                    </div> */}
                  {/* <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Attachments</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                          {attachments.map((attachment) => (
                            <li
                              key={attachment.name}
                              className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                            >
                              <div className="flex w-0 flex-1 items-center">
                                <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="ml-2 w-0 flex-1 truncate">{attachment.name}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <a href={attachment.href} className="font-medium text-blue-600 hover:text-blue-500">
                                  Download
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div> */}
                </dl>
              </div>
              {/* <div>
                  <a
                    href="#"
                    className="block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg"
                  >
                    Read full application
                  </a>
                </div> */}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Profile
