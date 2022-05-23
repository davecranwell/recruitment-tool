import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { api } from '~/api.server'

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const loader: LoaderFunction = async (data) => {
  return await api(data, `/applicant-profile/1`)
}

const ApplicantProfileIndex = () => {
  const data = useLoaderData()
  return <div>{data.id}</div>
}

export default ApplicantProfileIndex
