import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { api } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import type { LinkedApplicantProfile } from 'app/models/applicant-profiles/ApplicantProfile'

import ApplicantList from '~/components/ApplicantList'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants`)
}

const PositionApplicants = () => {
  const applicants = useLoaderData()
  const { id } = useParams()

  applicants.data.forEach(
    (applicant: LinkedApplicantProfile) => (applicant.link = `/positions/${id}/applicant/${applicant.id}`)
  )

  return (
    <div className="py-6">
      <ApplicantList applicants={applicants.data} emptyText={'There are no applicants for this position'} />
    </div>
  )
}

export default PositionApplicants
