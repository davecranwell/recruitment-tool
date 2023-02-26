export type Interviews = {
  averageScore: number
  scoringSystem: any
}

export type ApplicantProfile = {
  id: number
  askingSalary: string
  profileName: string
  updatedAt: Date
  user?: {
    email: string
    name: string
  }
  interviews: Interviews[]
}

export type LinkedApplicantProfile = ApplicantProfile & {
  link: string
}
