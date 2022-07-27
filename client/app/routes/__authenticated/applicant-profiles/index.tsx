import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { api, jsonWithHeaders } from 'app/api.server'
import { requireAuth } from 'app/sessions.server'

import Content from 'app/components/Content'
import ApplicantList from 'app/components/ApplicantList'

export const loader: LoaderFunction = async (data) => {
  const { request } = data
  const session = await requireAuth(request)

  const profiles = await api(data, `/applicant-profile/by-user/${session.user.id}`)
  return jsonWithHeaders({ session, profiles })
}

export const meta: MetaFunction = ({ data }) => {
  return { title: `Applicants to ${data?.session?.activeOrganisation?.name}` }
}

const ApplicantProfiles = () => {
  const { profiles } = useLoaderData()

  return (
    <Content
      title={'Applicant Profiles'}
      primaryAction={profiles.data.length && { label: 'Create', link: '/profile/new' }}
    >
      <ApplicantList applicants={profiles.data} emptyText="There are no applicants in this organisation" />
    </Content>
  )
}
export default ApplicantProfiles
