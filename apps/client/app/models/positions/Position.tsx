import { Project } from '../projects/Project'

export enum PositionEmploymentType {
  FULL,
  PART,
  CONTRACT,
}

export type Position = {
  id: number
  name: string
  salary?: string
  description?: String
  openingDate?: Date
  closingDate?: Date
  employment?: PositionEmploymentType
  organisationId: number
  location?: string
  salaryRange?: string
  project?: Partial<Project>
}
