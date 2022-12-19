import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { PaginationArgsDto, PaginatedDto } from 'src/page/pagination-args.dto'

import { ApplicantProfile } from './entities/applicant-profile.entity'
import { CreateApplicantProfileDto } from './dto/create-applicant-profile.dto'
import { UpdateApplicantProfileDto } from './dto/update-applicant-profile.dto'
import { UserService } from 'src/user/user.service'

type ApplicantProfileForPositionWithUsers = Prisma.ApplicantProfileForPositionGetPayload<{
  include: { applicantProfile: true }
}>

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class ApplicantProfileService {
  constructor(private prisma: PrismaService, private readonly userService: UserService) {}

  async create(data: CreateApplicantProfileDto) {
    return this.prisma.applicantProfile.create({
      data: {
        profileName: data.profileName,
        askingSalary: data.askingSalary,
        user: {
          connect: { id: data.userId },
        },
      },
    })
  }

  async findByUser(userId: number, paginationArgs: PaginationArgsDto) {
    // find if userId exsits first
    await this.userService.getById(userId)

    return paginate<ApplicantProfile, Prisma.ApplicantProfileFindManyArgs>(
      this.prisma.applicantProfile,
      { where: { userId } },
      { ...paginationArgs }
    )
  }

  async findWithUser(userId: number, paginationArgs: PaginationArgsDto) {
    // find if userId exsits first
    await this.userService.getById(userId)

    return paginate<ApplicantProfile, Prisma.ApplicantProfileFindManyArgs>(
      this.prisma.applicantProfile,
      { where: { userId }, include: { user: { select: { name: true } } } },
      { ...paginationArgs }
    )
  }

  async findByPosition(positionId: number, paginationArgs: PaginationArgsDto) {
    // TODO check if position exists

    const results = await paginate<
      ApplicantProfileForPositionWithUsers,
      Prisma.ApplicantProfileForPositionFindManyArgs
    >(
      this.prisma.applicantProfileForPosition,
      { where: { positionId }, include: { applicantProfile: true } },
      { ...paginationArgs }
    )

    ;(results as unknown as PaginatedDto<ApplicantProfile>).data = results.data.map((result) => ({
      ...result.applicantProfile,
    }))

    return results
  }

  async findOneInOrganisation(applicantProfileId: number, organisationId: number) {
    const results = await this.prisma.applicantProfileForOrganisation.findFirst({
      where: { organisationId, applicantProfileId },
    })

    if (!results) throw new NotFoundException('Applicant profile with this ID does not exist')

    return results
  }

  async findOne(id: number) {
    const record = await this.prisma.applicantProfile.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    })
    if (!record) throw new NotFoundException('Applicant profile with this ID does not exist')

    return record
  }
}
