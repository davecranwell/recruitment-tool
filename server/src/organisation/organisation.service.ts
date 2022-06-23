import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PaginatedDto, PaginationArgsDto } from 'src/page/pagination-args.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from 'src/user/entities/user.entity'
import { UsersInOrganisation } from 'src/users-in-organisation/entities/users-in-organisation.entity'
import { createPaginator } from 'src/util/pagination'

import { Position } from 'src/position/entities/position.entity'
import { CreateOrganisationDto } from './dto/create-organisation.dto'
import { Organisation } from './entities/organisation.entity'

import { Action } from 'src/casl/actions'
import { CaslPermissions } from 'src/casl/casl.permissions'

const paginate = createPaginator({ perPage: 20 })

@Injectable()
export class OrganisationService {
  constructor(private prisma: PrismaService, private readonly caslPermissions: CaslPermissions) {}

  create(data: CreateOrganisationDto) {
    return this.prisma.organisation.create({
      data: {
        name: data.name,
        machineName: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        users: {
          create: [
            {
              userId: data.userId,
              role: 'ORGANISATION_OWNER',
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

  async findPositions(organisationId: number, user: UserEntity, paginationArgs: PaginationArgsDto) {
    // if you're an org admin, get all positions
    // if you're a regular user, get all positions you're allocated to in some way
    const ability = this.caslPermissions.createForUser(user)

    if (ability.can(Action.Manage, new Organisation({ id: organisationId }))) {
      return await paginate<Position, Prisma.PositionFindManyArgs>(
        this.prisma.position,
        { where: { organisationId } },
        { ...paginationArgs }
      )
    }

    const results = await paginate<Position, Prisma.PositionFindManyArgs>(
      this.prisma.position,
      {
        where: {
          organisationId,
          userRoles: {
            some: {
              userId: user.id,
              role: {
                in: ['HIRING_MANAGER', 'INTERVIEWER'],
              },
            },
          },
        },
        include: { userRoles: { where: { userId: user.id } } },
      },
      { ...paginationArgs }
    )

    // strip salary range where role for this position is unsuitable
    results.data.forEach((position) => {
      if (!position.userRoles.every((userRole) => userRole.role === 'HIRING_MANAGER')) {
        delete position.salaryRange
      }
    })

    return results
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
