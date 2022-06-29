import { Organisation } from 'src/organisation/entities/organisation.entity'
import { ProjectUserRole } from 'src/project-user-role/entities/project-user-role.entity'
import { Position } from 'src/position/entities/position.entity'

export class Project {
  id: number
  name: string
  description: string | null
  organisation?: Organisation
  organisationId: number
  createdAt: Date
  updatedAt: Date
  userRoles?: ProjectUserRole[]
  positions?: Position[]
}
