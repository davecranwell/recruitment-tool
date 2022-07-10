export type Organisation = {
  id: any
  role: string
  userId: number
  organisationId: number
  createdAt: Date
  updatedAt: Date
  organisation: {
    id: number
    name: string
    machineName: string
    createdAt: Date
    updatedAt: Date
  }
}
