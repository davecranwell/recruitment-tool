/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterFromInvitationDto {
  name: string
  password: string
  passwordConfirmation: string
  /** An invitation code (in form of a JWT) */
  token: string
}

export type GoogleAuthDto = object

export interface File {
  key: string
  bucket: string
}

export interface Organisation {
  id: number
  name: string
  machineName: string
  logoId: number
  logo: File
  users: UsersInOrganisation
}

export interface UsersInOrganisation {
  user: UserEntity
  role: 'RECRUITER' | 'APPLICANT' | 'ORGANISATION_OWNER' | 'ORGANISATION_MEMBER' | 'STANDARD'
  userId: number
  organisation: Organisation
  organisationId: number
}

export interface UserEntity {
  id: number
  email: string
  name: string
  abilities: object
  avatarUrl: string
  organisations: UsersInOrganisation[]
}

export interface LoginResponseDto {
  user: UserEntity
  accessToken: string
  refreshToken: string
  abilities: object
}

export interface CreateOrganisationDto {
  name: string
}

export interface PaginationMetaDto {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev: number
  next: number
}

export interface PaginatedDto {
  data: any[][]
  meta: PaginationMetaDto
}

export interface PatchOrganisationUserDto {
  role: 'RECRUITER' | 'APPLICANT' | 'ORGANISATION_OWNER' | 'ORGANISATION_MEMBER' | 'STANDARD'
  name: string
}

export interface PositionCount {
  positions: number
}

export interface ProjectOnly {
  id: number
  name: string
  description: string
  organisationId: number
  defaultPipelineId: number
  approvalsNeeded: number
  /** @format date-time */
  updatedAt: string
  _count: PositionCount
}

export type ProjectUserRole = object

export interface Stage {
  id: number
  name: string
  order: number
  description: string
}

export interface Position {
  id: number
  name: string
  description: string
  /** @format date-time */
  openingDate: string
  /** @format date-time */
  closingDate: string
  approved: boolean
  /** @format date-time */
  createdAt: string
  pipelineId: number
  /** @format date-time */
  updatedAt: string
  projectId: number
  organisationId: number
  employment: 'FULL' | 'PART' | 'CONTRACT'
  location: string
  /** May not be present if unsufficiently privileged in position role */
  salaryRange: string
}

export interface Pipeline {
  id: number
  name: string
  description: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  organisationId: number
  organisation: Organisation
  stages: Stage[]
  positions: Position[]
}

export interface Project {
  id: number
  name: string
  description: string
  organisationId: number
  defaultPipelineId: number
  approvalsNeeded: number
  /** @format date-time */
  updatedAt: string
  userRoles: ProjectUserRole
  defaultPipeline: Pipeline
}

export interface CreateProjectDto {
  name: string
  description: string
  defaultPipelineId: number
  approvalsNeeded: number
  hiringManagers: any[][]
  interviewers: any[][]
  financialManagers: any[][]
  organisationId: number
}

export interface UpdateProjectDto {
  name: string
  description: string
  defaultPipelineId: number
  approvalsNeeded: number
  hiringManagers: any[][]
  interviewers: any[][]
  financialManagers: any[][]
}

export interface CreatePositionDto {
  name: string
  description: string
  /** @format date-time */
  openingDate: string
  /** @format date-time */
  closingDate: string
  projectId: number
  pipelineId: number
  employment: 'FULL' | 'PART' | 'CONTRACT'
  location: string
  salaryRange: string
}

export interface Interview {
  id: number
  applicantProfileId: number
  stageId: number
  positionId: number
  /** @format date-time */
  startDateTime: string
  /** @format date-time */
  endDateTime: string
  questionsId: number
  averageScore: number
  scoringSystemId: number
}

export interface ApplicantProfileWithUser {
  id: number
  profileName: string
  askingSalary: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  userId: number
  user: UserEntity
  interviews: Interview
}

export interface ApplicantProfile {
  id: number
  profileName: string
  askingSalary: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  userId: number
}

export interface ApplicantProfileForPositionWithStage {
  applicantProfile: ApplicantProfile
  applicantProfileId: number
  positionId: number
  stage: Stage
}

export interface UpdateApplicantStageDto {
  stage: number
}

export interface Assessment {
  id: number
  userId: number
  score: number
  applicantProfileId: number
  positionId: number
  interviewId: number
  notes: string
  scoringSystemId: number
}

export interface InterviewWithStageScoringApplicant {
  id: number
  applicantProfileId: number
  stageId: number
  positionId: number
  /** @format date-time */
  startDateTime: string
  /** @format date-time */
  endDateTime: string
  questionsId: number
  averageScore: number
  scoringSystemId: number
  stage: Stage
  applicantProfile: ApplicantProfileWithUser
  assessments: Assessment
}

export interface ApplicantCount {
  applicants: number
}

export interface StageWithApplicantCount {
  id: number
  name: string
  order: number
  description: string
  _count: ApplicantCount
}

export interface PipelineStagesOnly {
  stages: StageWithApplicantCount[]
}

export interface UpdatePositionDto {
  name?: string
  description?: string
  /** @format date-time */
  openingDate?: string
  /** @format date-time */
  closingDate?: string
  projectId?: number
  pipelineId?: number
  employment?: 'FULL' | 'PART' | 'CONTRACT'
  location?: string
  salaryRange?: string
}

export interface ApprovePositionDto {
  approved: boolean
}

export interface CreateApplicantProfileDto {
  profileName: string
  userId: number
  askingSalary: string
}

export interface CreateInvitationDto {
  email: string
  organisationId: number
  role: 'RECRUITER' | 'APPLICANT' | 'ORGANISATION_OWNER' | 'ORGANISATION_MEMBER' | 'STANDARD'
}

export interface CreateInterviewDto {
  /** @format date-time */
  startDateTime: string
  /** @format date-time */
  endDateTime: string
  positionId: number
  stageId: number
  applicantProfileId: number
  attendees: string[]
}

export interface CreateAssessmentDto {
  applicantProfileId: number
  positionId: number
  score?: number
  notes?: string
  interviewId?: number
}
