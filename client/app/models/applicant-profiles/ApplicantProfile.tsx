export type ApplicantProfile = {
  id: number
  askingSalary: string
  profileName: string
  updatedAt: Date
  user?: {
    email: string
    name: string
  }
}
