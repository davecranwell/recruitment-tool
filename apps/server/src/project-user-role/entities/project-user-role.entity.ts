import { ProjectRoleType, ProjectUserRole as ProjectUserRoleModel } from '@prisma/client'

import { Project } from 'src/project/entities/project.entity'
import { UserEntity as User } from 'src/user/entities/user.entity'

export class ProjectUserRole implements ProjectUserRoleModel {
  project?: Project
  projectId: number
  user?: User
  userId: number
  role: ProjectRoleType
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<ProjectUserRole>) {
    Object.assign(this, partial)
  }
}
