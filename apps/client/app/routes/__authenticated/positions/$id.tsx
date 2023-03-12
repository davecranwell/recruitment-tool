import { CalendarIcon, ClockIcon, CurrencyDollarIcon, LocationMarkerIcon, LockClosedIcon } from '@heroicons/react/solid'
import type { LoaderArgs, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import type { RouteMatch } from '@remix-run/react'
import { Link, Outlet, useLoaderData, useMatches } from '@remix-run/react'
import { PositionControllerGetPipelineReturnType } from 'sharedtypes/position.returntypes'

import { api } from 'app/api.server'
import { requireAuth } from '~/sessions.server'

import Content from 'app/components/Content'

import { MetaList, MetaListItem } from '~/components/MetaList'

import type { Position } from '~/models/positions/Position'
import { dateTimeFormat, toSentence } from '~/utils'
import Breadcrumb from 'app/components/Breadcrumb'
import Button from '~/components/Button'

export const handle = {
  breadcrumb: (match: RouteMatch) => <Link to={match.pathname}>{match.data.position.name}</Link>,
}

export const meta: MetaFunction = ({ data }) => {
  const { position } = data
  return { title: position.name }
}

export const loader = async (data: LoaderArgs) => {
  const { request, params } = data
  await requireAuth(request)

  const stagesRes = await api<PositionControllerGetPipelineReturnType>(data, `/position/${params.id}/pipeline`)
  const positionRes = await api(data, `/position/${params.id}`)

  const stages: PositionControllerGetPipelineReturnType = await stagesRes.json()
  const position = await positionRes.json()

  return json({ stages, position })
}

const PositionDetail = () => {
  const matches = useMatches()
  const { position, stages } = useLoaderData<typeof loader>()
  const { id, name, closingDate, description, location, salaryRange, employment } = position as Position

  return (
    <Content
      title={name}
      titleSize="larger"
      primaryAction={<Button color="success" text="Approve" />}
      secondaryAction={{ label: 'Edit', link: `/positions/${id}/edit` }}
    >
      <MetaList className="mb-4">
        <MetaListItem
          icon={CurrencyDollarIcon}
          title="This information is only visible to organisation owners or hiring managers"
        >
          {salaryRange && (
            <>
              {salaryRange!} <LockClosedIcon className="h-4 w-4 flex-shrink-0 text-yellow-600" />
            </>
          )}
        </MetaListItem>
        <MetaListItem icon={LocationMarkerIcon}>{location!}</MetaListItem>
        {employment && <MetaListItem icon={ClockIcon}>{toSentence(employment)}</MetaListItem>}
        {closingDate && <MetaListItem icon={CalendarIcon}>{`Closing on ${dateTimeFormat(closingDate!)}`}</MetaListItem>}
      </MetaList>

      {/* {description && (
        <div className="mt-8">
          <p>{description}</p>
        </div>
      )} */}

      <Outlet context={stages} />
    </Content>
  )
}

export default PositionDetail
