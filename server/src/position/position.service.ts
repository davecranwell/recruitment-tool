import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common'
import { ApplicantProfileForPosition, Prisma } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { PaginationArgsDto, PaginatedDto } from 'src/page/pagination-args.dto'
import { OrganisationService } from 'src/organisation/organisation.service'

import { CreatePositionDto } from './dto/create-position.dto'
import { UpdatePositionDto } from './dto/update-position.dto'

import { Position } from './entities/position.entity'

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

  // update(id: number, updatePositionDto: UpdatePositionDto) {
  //   return `This action updates a #${id} position`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} position`
  // }
}
