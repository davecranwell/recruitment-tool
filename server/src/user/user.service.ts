import { NotFoundException, HttpStatus, Injectable, ForbiddenException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PrismaService } from 'src/prisma/prisma.service'
import { UserEntity } from './entities/user.entity'
import { FindOneDto } from 'src/util/shared.dto'
import { CaslPermissions } from 'src/casl/casl.permissions'
import { Invitation, User } from '@prisma/client'
import { Ability } from '@casl/ability'
import { Action } from 'src/casl/actions'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private readonly caslPermissions: CaslPermissions) {}

  async findOne(id: number, requestUser: UserEntity) {
    const record = await this.prisma.user.findUnique({ where: { id }, include: { organisations: true } })
    if (!record) throw new NotFoundException('User with this ID does not exist')

    // TODO: this ability check seems wrong
    // It's intended for org admins to see about their users but that
    // see clietn: __authenticated/users/$id.edit.tsx
    const ability = new Ability(requestUser.abilities)
    if (!ability.can(Action.Read, new UserEntity(record))) throw new ForbiddenException()

    return new UserEntity(record)
  }

  async findOrganisations(id: number, requestUser: UserEntity) {
    return this.prisma.organisation.findMany({
      where: { users: { some: { userId: id } } },
    })
  }

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { organisations: { include: { organisation: true } } },
    })
    if (user) {
      return new UserEntity(user)
    }
    throw new NotFoundException('User with this id does not exist')
  }

  async getByIdWithAbilities(id: number) {
    const user = (await this.prisma.user.findUnique({
      where: { id },
      include: { organisations: { include: { organisation: true } } },
    })) as UserEntity

    if (user) {
      user.abilities = await this.caslPermissions.asJsonForUser(user)

      return new UserEntity(user)
    }
    throw new NotFoundException('User with this id does not exist')
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { organisations: { include: { organisation: true } } },
    })
    if (user) {
      return new UserEntity(user)
    }
    throw new NotFoundException('User with this email does not exist')
  }

  async getByEmailWithDetailedOrgs(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      // This double inclusion is ugly but saves a query, so stays for now.
      // If this is changed, the session processing in remix needs changes too.
      include: { organisations: { include: { organisation: true } } },
    })
    if (user) {
      return new UserEntity(user)
    }
    throw new NotFoundException('User with this email does not exist')
  }

  async create(
    accountData: {
      name: string
      email: string
      avatarUrl?: string
      password?: string
      OAuth2Tokens?: object
      isRegisteredWithGoogle?: boolean
    },
    invitation?: Invitation
  ): Promise<UserEntity> {
    const { role, organisationId } = invitation || {}

    return new UserEntity(
      await this.prisma.user.create({
        data: {
          ...accountData,
          organisations: invitation && {
            create: {
              role,
              organisationId,
            },
          },
        },
      })
    )
  }

  async setRefreshToken(refreshToken: string, userId: number) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    })
  }

  async removeRefreshToken(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    })
  }

  async getUserIfRefreshTokenMatches(userId: number, jwtId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    const isRefreshTokenMatching = await bcrypt.compare(jwtId, user.refreshTokenHash)

    if (isRefreshTokenMatching) return new UserEntity(user)
  }
}
