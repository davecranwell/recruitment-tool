import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { ApplicantProfile, Prisma, User } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { PaginationArgsDto, PaginatedDto } from 'src/page/pagination-args.dto'
import { OrganisationService } from 'src/organisation/organisation.service'

import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'

import { Position } from './entities/position.entity'
import { ApplicantProfileForPosition } from 'src/applicant-profile-for-position/entities/applicant-profile-for-position.entity'

const paginate = createPaginator({ perPage: 20 })
@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService, private readonly organisationService: OrganisationService) {}

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

  async findOne(id: number) {
    const record = await this.prisma.position.findFirst({ where: { id } })
    if (!record) throw new NotFoundException('Position with this ID does not exist')

    return record
  }

  async findApplicantProfiles(positionId: number, paginationArgs: PaginationArgsDto) {
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

  update(id: number, data: UpdatePositionDto) {
    return this.prisma.position.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        openingDate: data.openingDate,
        closingDate: data.closingDate,
        location: data.location,
        salaryRange: data.salaryRange,
      },
    })
  }

  // remove(id: number) {
  //   return `This action removes a #${id} position`
  // }
}
