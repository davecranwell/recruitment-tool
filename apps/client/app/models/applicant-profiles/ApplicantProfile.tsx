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

export type LinkedApplicantProfile = ApplicantProfile & {
  link: string
}
