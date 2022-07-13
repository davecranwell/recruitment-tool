import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useOutletContext, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { api, jsonWithHeaders } from '~/api.server'
import { requireAuth } from '~/sessions.server'

import type { LinkedApplicantProfile } from 'app/models/applicant-profiles/ApplicantProfile'

import Tabs from 'app/components/Tabs'
import ApplicantList from '~/components/ApplicantList'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants/${params.stage}`)
}

const Stage = () => {
  const stages = useOutletContext() as any
  const applicants = useLoaderData()
  const { id } = useParams()

  const totalCount = stages.stages.reduce((acc: number, curr: any) => {
    const { stage } = curr
    return (acc = acc + stage._count.applicants)
  }, 0)

  const tabs = [
    {
      name: 'All',
      href: `/positions/${id}`,
      count: totalCount,
    },
  ]

  tabs.push(
    ...stages.stages.map(({ stage }: { stage: any }) => ({
      name: stage.name,
      href: `/positions/${id}/${stage.id}`,
      count: stage._count.applicants,
    }))
  )

  applicants.data.forEach(
    (applicant: LinkedApplicantProfile) => (applicant.link = `/positions/${id}/applicant/${applicant.id}`)
  )

  return (
    <div className="py-6">
      <h2 className="text-lg font-medium text-gray-900">Candidates</h2>

      <Tabs tabs={tabs} />
      <ApplicantList applicants={applicants.data} />
    </div>
  )
}

export default Stage
