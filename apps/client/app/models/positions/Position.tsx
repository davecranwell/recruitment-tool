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
  location?: string
  salaryRange?: string
}
