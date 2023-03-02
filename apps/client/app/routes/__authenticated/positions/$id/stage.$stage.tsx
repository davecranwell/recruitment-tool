import type { LoaderFunction } from '@remix-run/node'
import { Link, RouteMatch, useLoaderData, useOutletContext, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { api } from '~/api.server'
import { requireAuth } from '~/sessions.server'

import type { LinkedApplicantProfile } from 'app/models/applicant-profiles/ApplicantProfile'
import type { Stage as StageType } from '~/models/positions/Stage'
import Tabs from 'app/components/Tabs'
import ApplicantList from '~/components/ApplicantList'
import Content from '~/components/Content'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants/${params.stage}`)
}

const Stage = () => {
  const { stages } = useOutletContext() as any
  const applicants = useLoaderData()
  const { id } = useParams()

  const totalCount = stages.reduce((acc: number, stage: StageType) => {
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
    ...stages.map((stage: StageType) => ({
      name: stage.name,
      href: `/positions/${id}/stage/${stage.id}`,
      count: stage?._count?.applicants,
    }))
  )

  applicants.data.forEach(
    (applicant: LinkedApplicantProfile) => (applicant.link = `/positions/${id}/applicant/${applicant.id}`)
  )

  return (
    <Content title="Candidates" titleSize="larger" padX={false}>
      <Tabs tabs={tabs} />
      <ApplicantList applicants={applicants.data} />
    </Content>
  )
}

export default Stage
