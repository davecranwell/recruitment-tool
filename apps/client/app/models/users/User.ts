export type UserRoleType = 'RECRUITER' | 'APPLICANT' | 'ORGANISATION_OWNER' | 'ORGANISATION_MEMBER' | 'STANDARD'

export type User = {
  id: number
  email: string
  name: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export type UserInOrganisation = {
  role: UserRoleType
  createdAt: '2022-06-30T20:37:29.766Z'
  updatedAt: '2022-06-30T20:37:29.766Z'
  user: User
}
