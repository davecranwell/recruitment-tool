import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { ApplicantProfile, Prisma, User } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { PaginationArgsDto, PaginatedDto } from 'src/page/pagination-args.dto'

import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'

import { Position } from './entities/position.entity'
import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'
import { Action } from 'src/casl/actions'
import { UserEntity } from 'src/user/entities/user.entity'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { UpdateApplicantStageDto } from './dto/update-applicant-stage.dto'

const paginate = createPaginator({ perPage: 20 })
@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService, private readonly caslPermissions: CaslPermissions) {}

  async create(data: CreatePositionDto) {
    return this.prisma.position.create({
      data: {
        name: data.name,
        description: data.description,
        openingDate: data.openingDate,
        closingDate: data.closingDate,
        organisation: {
          connect: { id: data.organisationId },
        },
      },
    })
  }

  // async findAll() {
  //   return this.prisma.position.findMany()
  // }

  async findOne(id: number, user: UserEntity) {
    const position = await this.prisma.position.findUnique({ where: { id }, include: { userRoles: true } })
    if (!position) throw new NotFoundException('Position with this ID does not exist')

    const ability = this.caslPermissions.createForUser(user)

    if (!ability.can(Action.Read, new Position(position))) throw new ForbiddenException()

    if (!ability.can(Action.Manage, new Position(position))) {
      delete position.userRoles
    }

    return position
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

  async findApplicant(positionId: number, applicantProfileId: number, user: UserEntity) {
    // used to test access to the position
    await this.findOne(positionId, user)

    const applicant = await this.prisma.applicantProfileForPosition.findFirst({
      where: { positionId, applicantProfileId },
      include: {
        applicantProfile: { include: { user: { select: { name: true, email: true } } } },
        stage: true,
      },
    })

    if (!applicant) throw new NotFoundException('Applicant is not associated with this position')

    return applicant
  }

  async findPipelineWithStages(positionId: number, user: UserEntity) {
    const position = await this.findOne(positionId, user)

    return this.prisma.pipeline.findUnique({
      where: { id: position.pipelineId },
      include: { stages: { orderBy: { order: 'asc' }, include: { stage: true } } },
    })
  }

  async update(id: number, data: UpdatePositionDto, user: UserEntity) {
    const ability = this.caslPermissions.createForUser(user)

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

    const ability = this.caslPermissions.createForUser(user)

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

  // remove(id: number) {
  //   return `This action removes a #${id} position`
  // }
}
