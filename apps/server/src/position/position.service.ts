import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ApplicantProfile, Prisma } from '@prisma/client'
import { Ability } from '@casl/ability'

import { PrismaService } from 'src/prisma/prisma.service'

import { PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { createPaginator } from 'src/util/pagination'

import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'

import {
  ApplicantProfileForPosition,
  ApplicantProfileForPositionWithStage,
} from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { Action } from 'src/casl/actions'
import { UserEntity } from 'src/user/entities/user.entity'
import { Interview, InterviewWithStageScoringApplicant } from 'src/interview/entities/interview.entity'
import { UpdateApplicantStageDto } from './dto/update-applicant-stage.dto'
import { Position } from './entities/position.entity'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'
import { Stage } from 'src/stage/entities/stage.entity'
import { Transform } from 'class-transformer'

export class PositionQueryFeatures {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  includePipeline?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  includeUserRoles?: boolean
}

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePositionDto, user: UserEntity) {
    // get project
    const project = await this.prisma.project.findUnique({ where: { id: data.projectId } })
    if (!project) throw new NotFoundException('Project with this ID does not exist')

    const ability = new Ability(user.abilities)
    if (
      !ability.can(Action.Create, new Position({ projectId: data.projectId, organisationId: project.organisationId }))
    )
      throw new ForbiddenException()

    return this.prisma.position.create({
      data: {
        name: data.name,
        description: data.description,
        openingDate: data.openingDate,
        closingDate: data.closingDate,
        project: {
          connect: { id: data.projectId },
        },
        organisation: {
          connect: { id: project.organisationId },
        },
      },
    })
  }

  // async findAll() {
  //   return this.prisma.position.findMany()
  // }

  async findOne(
    id: number,
    user: UserEntity,
    positionFeatures: PositionQueryFeatures = { includeUserRoles: false, includePipeline: false }
  ) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      include: {
        pipeline: {
          ...(positionFeatures.includePipeline === true && {
            include: {
              stages: {
                orderBy: { order: 'asc' },
                include: { stage: { include: { _count: { select: { applicants: true } } } } },
              },
            },
          }),
        },
        project: {
          ...(positionFeatures.includeUserRoles === true && {
            include: {
              userRoles: {
                include: { user: { select: { name: true, avatarUrl: true } } },
              },
            },
          }),
        },
      },
    })

    if (!position) throw new NotFoundException('Position with this ID does not exist')

    const ability = new Ability(user.abilities)

    if (!ability.can(Action.Read, new Position(position))) throw new ForbiddenException()

    return new Position(position)
  }

  // async findByOrganisation(organisationId: number, paginationArgs: PaginationArgsDto) {
  //   const positions = await paginate<Position, Prisma.PositionFindManyArgs>(
  //     this.prisma.position,
  //     { where: { organisationId } },
  //     { ...paginationArgs }
  //   )

  //   return positions
  // }

  async findAllApplicants(positionId: number, user: UserEntity, paginationArgs: PaginationArgsDto) {
    // used to test access to the position
    await this.findOne(positionId, user)

    const profiles = await paginate<ApplicantProfileForPosition, Prisma.ApplicantProfileForPositionFindManyArgs>(
      this.prisma.applicantProfileForPosition,
      {
        where: { positionId },
        include: { applicantProfile: { include: { user: { select: { name: true, email: true } } } } },
      },
      { ...paginationArgs }
    )

    ;(profiles as unknown as PaginatedDto<ApplicantProfile>).data = profiles.data.map((prof) => ({
      ...prof.applicantProfile,
    }))

    return profiles
  }

  async findApplicantsAtStage(
    positionId: number,
    stageId: number,
    user: UserEntity,
    paginationArgs: PaginationArgsDto
  ) {
    // used to test access to the position
    await this.findOne(positionId, user)

    const profiles = await paginate<ApplicantProfileForPosition, Prisma.ApplicantProfileForPositionFindManyArgs>(
      this.prisma.applicantProfileForPosition,
      {
        where: { positionId, stageId },
        include: { applicantProfile: { include: { user: { select: { name: true, email: true } } } } },
      },
      { ...paginationArgs }
    )

    ;(profiles as unknown as PaginatedDto<ApplicantProfile>).data = profiles.data.map((prof) => ({
      ...prof.applicantProfile,
    }))

    return profiles
  }

  async findApplicant(positionId: number, applicantProfileId: number, user: UserEntity) {
    // used to test access to the position
    await this.findOne(positionId, user)

    const applicant = await this.prisma.applicantProfileForPosition.findFirst({
      where: { positionId, applicantProfileId },
      include: {
        applicantProfile: {
          include: {
            user: { select: { name: true, email: true } },
            interviews: { select: { id: true, stageId: true } },
          },
        },
        stage: true,
        position: { select: { organisationId: true } },
      },
    })

    if (!applicant) throw new NotFoundException('Applicant is not associated with this position')

    return new ApplicantProfileForPositionWithStage(applicant)
  }

  // TODO: Should this be moved to the interview service, or is it worth staying here as
  // a relation of the position?
  async findInterviewById(positionId: number, interviewId: number, user: UserEntity) {
    // used to test access to the position
    await this.findOne(positionId, user)

    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId },
      include: {
        applicantProfile: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
          },
        },
        stage: true,
        scoringSystem: true,
        questions: {
          select: { id: true, questions: true },
        },
        assessments: {
          where: {
            interviewId,
            userId: user.id,
          },
        },
      },
    })

    // const applicant = await this.prisma.applicantProfileForPosition.findFirst({
    //   where: { positionId, applicantProfileId },
    //   include: {
    //     applicantProfile: {
    //       include: {
    //         user: { select: { name: true, email: true } },
    //         interviews: { select: { id: true, stageId: true } },
    //       },
    //     },
    //     stage: true,
    //     position: { select: { organisationId: true } },
    //   },
    // })

    if (!interview) throw new NotFoundException('Interview not found')

    return new InterviewWithStageScoringApplicant(interview)
  }

  async findPipelineWithStages(positionId: number, user: UserEntity) {
    const position = await this.findOne(positionId, user)

    if (!position.pipelineId) throw new ForbiddenException()

    return this.prisma.pipeline.findUnique({
      where: { id: position.pipelineId },
      include: {
        stages: {
          orderBy: { order: 'asc' },
          include: { stage: { include: { _count: { select: { applicants: true } } } } },
        },
      },
    })
  }

  async update(id: number, data: UpdatePositionDto, user: UserEntity) {
    const ability = new Ability(user.abilities)

    const position = await this.findOne(id, user)

    if (!ability.can(Action.Update, new Position(position))) throw new ForbiddenException()

    return this.prisma.position.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        employment: data.employment,
        location: data.location,
        openingDate: data.openingDate,
        closingDate: data.closingDate,
        salaryRange: data.salaryRange,
      },
    })
  }

  async changeApplicantStage(
    positionId: number,
    applicantProfileId: number,
    data: UpdateApplicantStageDto,
    user: UserEntity
  ) {
    const position = await this.findOne(positionId, user)

    const ability = new Ability(user.abilities)

    if (!ability.can(Action.Update, new Position(position))) throw new ForbiddenException()

    // check if chosen stage is allowed
    const stageValid = await this.prisma.stagesInPipeline.findFirst({
      where: { pipelineId: position.pipelineId, stageId: data.stage },
    })

    if (!stageValid) throw new ForbiddenException()

    return this.prisma.applicantProfileForPosition.updateMany({
      where: {
        applicantProfileId,
        positionId,
      },
      data: {
        stageId: data.stage,
      },
    })
  }
}
