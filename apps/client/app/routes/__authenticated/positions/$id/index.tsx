import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useOutletContext, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import type { LinkedApplicantProfile } from 'app/models/applicant-profiles/ApplicantProfile'

import Tabs from 'app/components/Tabs'
import ApplicantList from '~/components/ApplicantList'
import Content from '~/components/Content'
import type { Stage } from '~/models/positions/Stage'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants`)
}

const PositionApplicants = () => {
  const { stages } = useOutletContext() as any
  const applicants = useLoaderData()
  const { id } = useParams()

  const totalCount = stages.reduce((acc: number, stage: Stage) => {
    return (acc = acc + (stage?._count?.applicants || 0))
  }, 0)

  const tabs = [
    {
      name: 'All',
      href: `/positions/${id}`,
      count: totalCount,
    },
  ]

  tabs.push(
    ...stages.map((stage: Stage) => ({
      name: stage.name,
      href: `/positions/${id}/stage/${stage.id}`,
      count: stage?._count?.applicants,
    }))
  )

  applicants.data.forEach(
    (applicant: LinkedApplicantProfile) => (applicant.link = `/positions/${id}/applicant/${applicant.id}`)
  )

  return (
    <Content as="div" title="Candidates" titleSize="larger" padX={false}>
      <Tabs tabs={tabs} />
      <ApplicantList applicants={applicants.data} emptyText={'There are no applicants for this position'} />
    </Content>
  )
}

export default PositionApplicants
