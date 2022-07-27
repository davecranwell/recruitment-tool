import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useOutletContext, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import type { LinkedApplicantProfile } from 'app/models/applicant-profiles/ApplicantProfile'

import Tabs from 'app/components/Tabs'
import ApplicantList from '~/components/ApplicantList'
import Content from '~/components/Content'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants`)
}

const PositionApplicants = () => {
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
    <Content title="Candidates" titleSize="larger">
      <Tabs tabs={tabs} />
      <ApplicantList applicants={applicants.data} emptyText={'There are no applicants for this position'} />
    </Content>
  )
}

export default PositionApplicants
