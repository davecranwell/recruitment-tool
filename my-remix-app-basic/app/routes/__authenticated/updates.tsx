import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { api } from 'app/api.server'

import Content from 'app/components/Content'

export async function loader({ request }: { request: Request }) {
  return await api(request, '/updates')
}

const Updates = () => {
  const data = useLoaderData()

  return (
    <Content title={'Updates'}>
      {data.map((d) => (
        <div key={d.id}>{d.id}</div>
      ))}
    </Content>
  )
}
export default Updates
