import type { LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'

import { api } from '~/api.server'
import { requireAuth } from '~/sessions.server'

import ApplicantList from '~/components/ApplicantList'

export const loader: LoaderFunction = async (data) => {
  const { request, params } = data
  invariant(params.id, 'Expected position ID')

  await requireAuth(request)

  return await api(data, `/position/${params.id}/applicants/${params.stage}`)
}

const Stage = () => {
  const applicants = useLoaderData()

  return (
    <div className="py-6">
      <ApplicantList applicants={applicants.data} />
    </div>
  )
}

export default Stage
