import { Injectable, NotFoundException } from '@nestjs/common'
import { ApplicantProfileForPosition, User, Prisma } from '@prisma/client'

import { PrismaService } from 'src/prisma/prisma.service'
import { createPaginator } from 'src/util/pagination'
import { PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { UserEntity } from 'src/user/entities/user.entity'

import { Organisation } from './entities/organisation.entity'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { UpdateOrganisationDto } from './dto/update-organisation.dto'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class OrganisationService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrganisationDto) {
    return this.prisma.organisation.create({
      data: {
        name: data.name,
        machineName: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        users: {
          create: [
            {
              userId: data.userId,
            },
          ],
        },
      },
    })
  }

  // findAll() {
  //   return `This action returns all organisation`
  // }

  async findUsers(organisationId: number, paginationArgs: PaginationArgsDto) {
    const userOrgs = await paginate<UsersInOrganisation, Prisma.UsersInOrganisationFindFirstArgs>(
      this.prisma.usersInOrganisation,
      { where: { organisationId }, include: { user: true } },
      { ...paginationArgs }
    )

    ;(userOrgs as unknown as PaginatedDto<UserEntity>).data = userOrgs.data.map((userOrg) => ({ ...userOrg.user }))

    return userOrgs
  }

  async findOne(id: number) {
    const record = await this.prisma.organisation.findUnique({ where: { id } })
    if (!record) throw new NotFoundException('Organisation with this ID does not exist')

    return record
  }

  // update(id: number, updateOrganisationDto: UpdateOrganisationDto) {
  //   return `This action updates a #${id} organisation`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} organisation`
  // }
}
